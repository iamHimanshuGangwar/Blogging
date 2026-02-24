import React, { useState } from "react";
import { Brain, TrendingUp, Zap, Award, ArrowRight } from "lucide-react";

/**
 * Job Recommendation Engine
 * Uses skill matching and user behavior to suggest relevant jobs
 */
const JobRecommendationEngine = ({ jobs = [], userSkills = [], appliedJobs = [] }) => {
  const [suggestedJobs, setSuggestedJobs] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Calculate recommendation score
  const calculateRecommendationScore = (job) => {
    let score = 0;
    const jobText = `${job.title} ${job.description} ${job.industry}`.toLowerCase();

    // Skill match (weight: 40%)
    const matchedSkills = userSkills.filter((skill) =>
      jobText.includes(skill.toLowerCase())
    );
    const skillScore = (matchedSkills.length / Math.max(userSkills.length, 1)) * 40;
    score += Math.min(skillScore, 40);

    // Industry preference (weight: 20%)
    if (jobText.includes("technology") || jobText.includes("startup")) {
      score += 15;
    } else {
      score += 5;
    }

    // Seniority alignment (weight: 20%)
    if (
      jobText.includes("senior") ||
      jobText.includes("lead") ||
      jobText.includes("principal")
    ) {
      score += 15;
    } else if (jobText.includes("junior") || jobText.includes("entry")) {
      score += 10;
    }

    // Recency bonus (weight: 10%)
    const isNewJob = Math.random() > 0.5; // Mock recency
    if (isNewJob) {
      score += 10;
    }

    // Already applied penalty
    if (appliedJobs.includes(job._id)) {
      score *= 0.5;
    }

    return Math.round(Math.min(100, score));
  };

  const generateRecommendations = () => {
    const scored = jobs
      .map((job) => ({
        ...job,
        recommendationScore: calculateRecommendationScore(job),
      }))
      .filter((job) => job.recommendationScore > 30)
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, 5);

    setSuggestedJobs(scored);
    setShowRecommendations(true);
  };

  const getRecommendationReason = (job) => {
    const reasons = [];

    if (job.recommendationScore >= 80) {
      reasons.push("Perfect match for your profile");
    } else if (job.recommendationScore >= 60) {
      reasons.push("Great opportunities");
    } else {
      reasons.push("Worth exploring");
    }

    if (job.industry === "Technology") {
      reasons.push("In your preferred industry");
    }

    if (job.jobType === "Remote") {
      reasons.push("Remote friendly");
    }

    return reasons.slice(0, 2);
  };

  const getRecommendationColor = (score) => {
    if (score >= 80) return { bg: "from-green-500 to-emerald-500", light: "bg-green-50 dark:bg-green-900/20" };
    if (score >= 60) return { bg: "from-blue-500 to-cyan-500", light: "bg-blue-50 dark:bg-blue-900/20" };
    return { bg: "from-purple-500 to-pink-500", light: "bg-purple-50 dark:bg-purple-900/20" };
  };

  return (
    <div className="space-y-6">
      {/* Recommendation Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Personalized Recommendations
          </h3>
        </div>
        <button
          onClick={generateRecommendations}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center gap-2"
        >
          <Zap size={18} />
          Generate
        </button>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Our AI analyzes your skills and preferences to find the perfect opportunities for you.
        </p>
      </div>

      {/* Recommendations Grid */}
      {showRecommendations && suggestedJobs.length > 0 ? (
        <div className="space-y-4">
          {suggestedJobs.map((job) => {
            const colors = getRecommendationColor(job.recommendationScore);
            const reasons = getRecommendationReason(job);

            return (
              <div
                key={job._id}
                className={`p-5 rounded-xl border-2 border-transparent ${colors.light} hover:shadow-lg transition`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-gray-900 dark:text-white">
                        {job.title}
                      </h4>
                      <span className="inline-block px-2 py-1 bg-white dark:bg-gray-800 rounded text-xs font-bold text-gray-700 dark:text-gray-300">
                        {job.company}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {reasons.map((reason, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 bg-white dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300 font-medium"
                        >
                          ✓ {reason}
                        </span>
                      ))}
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {job.description}
                    </p>
                  </div>

                  {/* Score Badge */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${colors.bg} flex items-center justify-center`}
                    >
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">
                          {job.recommendationScore}
                        </div>
                        <div className="text-xs text-white/80 font-semibold">Score</div>
                      </div>
                    </div>
                    <button className="mt-3 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition">
                      <ArrowRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${colors.bg}`}
                    style={{ width: `${job.recommendationScore}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : showRecommendations && suggestedJobs.length === 0 ? (
        <div className="text-center py-12">
          <Award className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            No recommendations at the moment. Try expanding your filters!
          </p>
        </div>
      ) : (
        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800 text-center">
          <TrendingUp className="w-10 h-10 mx-auto text-blue-600 dark:text-blue-400 mb-3" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Click "Generate" to see jobs tailored just for you
          </p>
          <button
            onClick={generateRecommendations}
            className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
          >
            <Zap size={18} />
            Get Started
          </button>
        </div>
      )}
    </div>
  );
};

export default JobRecommendationEngine;
