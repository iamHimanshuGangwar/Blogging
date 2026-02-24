import React, { useState } from "react";
import { LogIn, AlertCircle, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

/**
 * Enhanced Auth Gate Component
 * Deferred authentication pattern:
 * - User starts action (apply/post job)
 * - Login modal appears only on submit
 * - Smooth signin/signup with email magic link or password
 */
const EnhancedAuthGate = ({
  isOpen,
  onClose,
  actionType = "apply", // "apply", "post", "favorite"
  onSuccess,
  userEmail,
}) => {
  const [step, setStep] = useState("choose"); // choose -> signin -> signup -> verify
  const [email, setEmail] = useState(userEmail || "");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [usePassword, setUsePassword] = useState(false); // Toggle between email link and password

  const actionMessages = {
    apply: {
      title: "Let's Secure Your Application",
      subtitle:
        "Create an account to apply for jobs and track your applications",
      cta: "Continue with Email",
    },
    post: {
      title: "Post a Job Opportunity",
      subtitle: "Sign in to post your job and find great candidates",
      cta: "Continue with Email",
    },
    favorite: {
      title: "Save Your Favorites",
      subtitle: "Create an account to save jobs and personalize your experience",
      cta: "Continue with Email",
    },
  };

  const config = actionMessages[actionType] || actionMessages.apply;

  const handleSignUpWithEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In production: Call backend to create account with email verification
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call

      toast.success("Check your email for verification code!");
      setStep("verify");
    } catch (error) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInWithEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In production: Call backend to send login link
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Check your email for login link!");
      setStep("verify");
    } catch (error) {
      toast.error("Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In production: Verify code and create session
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Welcome! 🎉");
      onSuccess?.({
        email,
        fullName: fullName || "User",
        verified: true,
      });
      resetForm();
      onClose();
    } catch (error) {
      toast.error("Invalid verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStep("choose");
    setEmail("");
    setPassword("");
    setFullName("");
    setVerificationCode("");
    setUsePassword(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
      {/* Modal Container */}
      <div
        className="card-glass rounded-2xl max-w-md w-full"
        style={{ animation: "slideUpIn 0.3s ease-out" }}
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-900 dark:to-indigo-900 p-6 rounded-t-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <LogIn className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">{config.title}</h2>
          </div>
          <p className="text-blue-100 text-sm">{config.subtitle}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Step: Choose Auth Method */}
          {step === "choose" && (
            <div className="space-y-3 animate-fadeIn">
              <button
                onClick={() => {
                  setStep("signin");
                  setUsePassword(false);
                }}
                className="w-full p-4 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition text-left"
              >
                <div className="font-semibold text-gray-900 dark:text-white">
                  Sign In
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an account? Log in with email
                </div>
              </button>

              <button
                onClick={() => {
                  setStep("signup");
                  setUsePassword(false);
                }}
                className="w-full p-4 border border-indigo-200 dark:border-indigo-800 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition text-left bg-indigo-50/50 dark:bg-indigo-900/10"
              >
                <div className="font-semibold text-gray-900 dark:text-white">
                  Create Account
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  New here? Sign up in seconds
                </div>
              </button>

              {/* Social Auth Placeholder */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <button
                disabled
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium disabled:opacity-50"
              >
                Google (Coming Soon)
              </button>
            </div>
          )}

          {/* Step: Sign In */}
          {step === "signin" && (
            <form
              onSubmit={usePassword ? undefined : handleSignInWithEmail}
              className="space-y-4 animate-fadeIn"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              {usePassword && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin">⟳</span> Sending...
                  </>
                ) : (
                  "Send Magic Link"
                )}
              </button>

              {!usePassword && (
                <button
                  type="button"
                  onClick={() => setUsePassword(true)}
                  className="w-full text-sm text-blue-600 dark:text-blue-400 hover:underline py-2"
                >
                  Use password instead
                </button>
              )}

              <button
                type="button"
                onClick={() => setStep("choose")}
                className="w-full text-sm text-gray-600 dark:text-gray-400 hover:underline py-2"
              >
                Back
              </button>
            </form>
          )}

          {/* Step: Sign Up */}
          {step === "signup" && (
            <form
              onSubmit={handleSignUpWithEmail}
              className="space-y-4 animate-fadeIn"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 rounded-lg text-xs text-blue-700 dark:text-blue-300">
                <p className="font-semibold mb-1">✓ Privacy-first signup</p>
                <p>We'll send a verification email. Your resume stays private.</p>
              </div>

              <button
                type="submit"
                disabled={isLoading || !email || !fullName}
                className="w-full p-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin">⟳</span> Creating...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep("choose")}
                className="w-full text-sm text-gray-600 dark:text-gray-400 hover:underline py-2"
              >
                Back
              </button>
            </form>
          )}

          {/* Step: Verify */}
          {step === "verify" && (
            <form
              onSubmit={handleVerification}
              className="space-y-4 animate-fadeIn"
            >
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 rounded-lg flex items-gap-2">
                <CheckCircle className="text-green-600 dark:text-green-400 flex-shrink-0" />
                <p className="text-sm text-green-700 dark:text-green-300">
                  Check your email for a verification code
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="000000"
                  maxLength="6"
                  className="w-full p-3 text-center text-2xl letter-spacing-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || verificationCode.length < 6}
                className="w-full p-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin">⟳</span> Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("choose");
                  setVerificationCode("");
                }}
                className="w-full text-sm text-gray-600 dark:text-gray-400 hover:underline py-2"
              >
                Back
              </button>
            </form>
          )}
        </div>

        {/* Footer Note */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            By signing in, you agree to our Terms of Service and Privacy Policy.
            We respect your data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAuthGate;
