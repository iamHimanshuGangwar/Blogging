// client/src/components/Navbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon, LogOut, ChevronDown } from "lucide-react";

const Navbar = () => {
  const { token, user, theme, toggleTheme, setUser, setToken } = useAppContext();
  const { openLogin, openSignup } = useAuth();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [profileOpen]);

  const gradientNav = "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500";
  const hoverBg = "hover:bg-white/20";

  return (
    <>
      <nav className={`w-full ${gradientNav} shadow-md sticky top-0 z-50`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 text-white">

            {/* ===== LOGO + LEFT MENU ===== */}
            <div className="flex items-center gap-6">

              {/* LOGO */}
              <img
                onClick={() => navigate("/")}
                src={assets.logo}
                alt="logo"
                className="w-32 cursor-pointer"
              />

              {/* NAV BUTTONS */}
              <button
                onClick={() => {
                  if (!user) {
                    openLogin();
                    return;
                  }
                  navigate("/resume-builder");
                }}
                className="hidden sm:block px-3 py-1.5 rounded-full text-sm hover:bg-white/20 transition"
              >
                Resume Builder
              </button>

              <button
                onClick={() => {
                  if (!user) {
                    openLogin();
                    return;
                  }
                  navigate("/image-generator");
                }}
                className="hidden sm:block px-3 py-1.5 rounded-full text-sm hover:bg-white/20 transition"
              >
                AI Image Generator
              </button>

              <button
                onClick={() => {
                  if (!user) {
                    openLogin();
                    return;
                  }
                  navigate("/jobs");
                }}
                className="hidden sm:block px-3 py-1.5 rounded-full text-sm hover:bg-white/20 transition"
              >
                Jobs
              </button>

              <button
                onClick={() => {
                  if (!user) {
                    openLogin();
                    return;
                  }
                  navigate("/blogs");
                }}
                className="hidden sm:block px-3 py-1.5 rounded-full text-sm hover:bg-white/20 transition"
              >
                Blogs
              </button>
            </div>

            {/* ===== RIGHT SIDE BUTTONS ===== */}
            <div className="flex items-center gap-4">

              {/* DARK / LIGHT MODE */}
              <button onClick={toggleTheme} className={`p-2 rounded-full ${hoverBg}`}>
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-yellow-300" />
                ) : (
                  <Moon className="w-5 h-5 text-white" />
                )}
              </button>

              {/* LOGIN / SIGNUP / LOGOUT / DASHBOARD */}
              {!token ? (
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    onClick={openLogin}
                    className="px-4 py-1.5 rounded-full bg-white text-purple-600 hover:bg-gray-100 text-sm font-medium"
                  >
                    Login
                  </button>

                  <button
                    onClick={openSignup}
                    className="px-4 py-1.5 rounded-full border border-white text-white hover:bg-white hover:text-purple-600 text-sm font-medium transition"
                  >
                    Signup
                  </button>
                </div>
              ) : user?.isAdmin ? (
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    onClick={() => navigate("/admin")}
                    className="px-4 py-1.5 rounded-full bg-green-500 text-white text-sm hover:bg-green-600 transition font-medium"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setToken(null);
                      setUser(null);
                      navigate("/");
                    }}
                    className="px-4 py-1.5 rounded-full bg-red-500 text-white text-sm hover:bg-red-600 transition font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2 relative" ref={profileRef}>
                  {/* User Profile Dropdown */}
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/20 transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-white font-bold text-sm">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="text-white text-sm font-medium hidden md:inline">
                      {user?.name || "User"}
                    </span>
                    <ChevronDown size={18} className={`transition ${profileOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {profileOpen && (
                    <div className="absolute top-12 right-0 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 z-50 border border-gray-200 dark:border-gray-700">
                      {/* Profile Info */}
                      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">
                            {user?.name || "User"}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {user?.email || "user@example.com"}
                          </p>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <button
                        onClick={() => {
                          navigate("/resume-builder");
                          setProfileOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded mb-2"
                      >
                        📄 Resume Builder
                      </button>
                      <button
                        onClick={() => {
                          navigate("/jobs");
                          setProfileOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded mb-2"
                      >
                        💼 Job Portal
                      </button>
                      <button
                        onClick={() => {
                          navigate("/settings");
                          setProfileOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded mb-3"
                      >
                        ⚙️ Settings
                      </button>

                      {/* Logout */}
                      <button
                        onClick={() => {
                          setToken(null);
                          setUser(null);
                          setProfileOpen(false);
                          navigate("/");
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded font-medium border-t border-gray-200 dark:border-gray-700 pt-3"
                      >
                        Logout
                        <LogOut size={16} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ===== MOBILE MENU BUTTON ===== */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`p-2 rounded-md sm:hidden ${hoverBg}`}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* ===== MOBILE MENU ===== */}
        {mobileOpen && (
          <div className="md:hidden bg-white text-black px-4 py-4 space-y-3">
            <button
              onClick={() => { 
                if (!user) {
                  openLogin();
                  setMobileOpen(false);
                  return;
                }
                navigate("/resume-builder"); 
                setMobileOpen(false); 
              }}
              className="block w-full text-left py-2"
            >
              Resume Builder
            </button>
            <button
              onClick={() => { 
                if (!user) {
                  openLogin();
                  setMobileOpen(false);
                  return;
                }
                navigate("/image-generator"); 
                setMobileOpen(false); 
              }}
              className="block w-full text-left py-2"
            >
              AI Image Generator
            </button>
            <button
              onClick={() => { 
                if (!user) {
                  openLogin();
                  setMobileOpen(false);
                  return;
                }
                navigate("/jobs"); 
                setMobileOpen(false); 
              }}
              className="block w-full text-left py-2"
            >
              Jobs
            </button>
            <button
              onClick={() => { if (!user) { openLogin(); setMobileOpen(false); return; } navigate("/blogs"); setMobileOpen(false); }}
              className="block w-full text-left py-2"
            >
              Blogs
            </button>

            {!token ? (
              <>
                <button
                  onClick={() => { openLogin(); setMobileOpen(false); }}
                  className="block w-full text-left py-2 font-medium"
                >
                  Login
                </button>
                <button
                  onClick={() => { openSignup(); setMobileOpen(false); }}
                  className="block w-full text-left py-2 font-medium"
                >
                  Signup
                </button>
              </>
            ) : user?.isAdmin ? (
              <>
                <button
                  onClick={() => { navigate("/admin"); setMobileOpen(false); }}
                  className="block w-full text-left py-2 text-green-500 font-semibold"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => { setToken(null); setUser(null); navigate("/"); setMobileOpen(false); }}
                  className="block w-full text-left py-2 text-red-500 font-semibold"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => { setToken(null); setUser(null); navigate("/"); setMobileOpen(false); }}
                className="block w-full text-left py-2 text-red-500 font-semibold"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
