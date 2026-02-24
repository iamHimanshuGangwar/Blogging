import React from "react";
import { Star, Shield, TrendingUp } from "lucide-react";

/**
 * User Profile Card for Job Portal Sidebar
 * Shows trust score, job match percentage, and saved jobs
 */
const UserProfileCard = ({ user, trustScore = 92, jobMatch = 97 }) => {
  return (
    <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl">
      {/* Profile Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold">
              {user?.name?.charAt(0) || "U"}
            </span>
          </div>
          <div>
            <h3 className="font-bold text-lg">{user?.name || "User"}</h3>
            <p className="text-blue-100 text-sm">{user?.email || "user@email.com"}</p>
          </div>
        </div>
        <Star size={20} className="fill-yellow-300 text-yellow-300" />
      </div>

      {/* Scores */}
      <div className="space-y-4 mb-6">
        {/* Trust Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Shield size={16} />
              <span className="text-sm font-semibold">Trust Score</span>
            </div>
            <span className="text-2xl font-bold">{trustScore}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${trustScore}%` }}
            />
          </div>
        </div>

        {/* Job Match */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} />
              <span className="text-sm font-semibold">Job Match</span>
            </div>
            <span className="text-2xl font-bold">{jobMatch}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-green-300 rounded-full transition-all duration-500"
              style={{ width: `${jobMatch}%` }}
            />
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-3 text-center">
        <p className="text-xs text-blue-100 mb-1">Status</p>
        <p className="font-bold flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          Actively Looking
        </p>
      </div>
    </div>
  );
};

export default UserProfileCard;
