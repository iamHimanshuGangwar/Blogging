import React, { useState, useEffect } from "react";
import { Zap, TrendingUp, BookOpen, Target } from "lucide-react";
import { AIJobAnalyzer } from "../../utils/AIJobAnalyzer";

/**
 * AI Job Insights Component
 * Shows AI-generated insights about why a job is good for the user
 */
const AIJobInsights = ({ job, userProfile = {}, isExpanded = false }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const result = await AIJobAnalyzer.analyzeJobMatch(job, userProfile);
        setInsights(result);
      } catch (error) {
        console.error("Error fetching insights:", error);
        setInsights(AIJobAnalyzer.getDefaultInsights());
      } finally {
        setLoading(false);
      }
    };

    if (job) {
      fetchInsights();
    }
  }, [job, userProfile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-3">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <span className="inline-block animate-spin mr-2">⚡</span>
          Analyzing job...
        </div>
      </div>
    );
  }

  if (!insights) {
    return null;
  }

  if (!isExpanded) {
    // Compact view - just show score and key insight
    return (
      <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
        <Zap size={16} className="text-blue-600" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">
            AI Match Score: {insights.recommendationScore}%
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 truncate">
            {insights.whyGoodMatch}
          </p>
        </div>
      </div>
    );
  }

  // Expanded view
  return (
    <div className="space-y-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800/50">
      {/* Score */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap size={18} className="text-yellow-600 dark:text-yellow-500" />
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            AI Match Score
          </span>
        </div>
        <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
          {insights.recommendationScore}%
        </div>
      </div>

      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
          style={{ width: `${insights.recommendationScore}%` }}
        />
      </div>

      {/* Why Good Match */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Target size={16} className="text-green-600 dark:text-green-400" />
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Why It's a Good Match
          </p>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {insights.whyGoodMatch}
        </p>
      </div>

      {/* Skills to Learn */}
      {insights.skillsToLearn && insights.skillsToLearn.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={16} className="text-orange-600 dark:text-orange-400" />
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Skills to Learn
            </p>
          </div>
          <div className="flex flex-wrap gap-1">
            {insights.skillsToLearn.map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-1 text-xs rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Career Path */}
      {insights.careerPath && (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-purple-600 dark:text-purple-400" />
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Career Impact
            </p>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {insights.careerPath}
          </p>
        </div>
      )}

      {/* Salary Insight */}
      {insights.salaryInsight && (
        <div className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            <strong>💰 Salary:</strong> {insights.salaryInsight}
          </p>
        </div>
      )}
    </div>
  );
};

export default AIJobInsights;
