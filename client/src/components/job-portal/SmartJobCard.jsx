import React, { useState, useCallback } from "react";
import { Heart, Share2, MapPin, Clock } from "lucide-react";
import toast from "react-hot-toast";

/**
 * Smart JobCard with favoriting, sharing, and smart recommendations
 * Integrates with the Adaptive Atmosphere system
 */
const SmartJobCard = ({
  job,
  matchScore,
  isApplied,
  isFavorited: initialFavorited = false,
  onApply,
  onViewDetails,
  onFavorite,
  showSalaryInsights = false,
  onShare,
}) => {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handleFavorite = useCallback(() => {
    setIsFavorited(!isFavorited);
    if (onFavorite) {
      onFavorite(job._id, !isFavorited);
    }
    toast.success(
      !isFavorited ? "Added to favorites 💖" : "Removed from favorites"
    );
  }, [isFavorited, job._id, onFavorite]);

  const handleShare = useCallback(
    (platform) => {
      const shareText = `Check out this ${job.title} opportunity at ${job.company}!`;
      const shareUrl = `${window.location.origin}/jobs?job=${job._id}`;

      const urls = {
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${shareUrl}`,
        email: `mailto:?subject=${encodeURIComponent(`Job: ${job.title}`)}&body=${encodeURIComponent(shareText)}`,
        copy: shareUrl,
      };

      if (platform === "copy") {
        navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
      } else if (urls[platform]) {
        window.open(urls[platform], "_blank");
      }

      setShowShareMenu(false);
      if (onShare) onShare(job._id, platform);
    },
    [job, onShare]
  );

  // Calculate days since job posted (mock data)
  const daysPosted = Math.floor(Math.random() * 30) + 1;
  const isHotJob = daysPosted < 3;

  return (
    <div className="card-glass rounded-2xl breathable-padding hover:shadow-2xl transition group relative overflow-hidden">
      {/* Hot Job Badge */}
      {isHotJob && (
        <div className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
          🔥 Hot Job
        </div>
      )}

      {/* Favorite Button */}
      <button
        onClick={handleFavorite}
        className="absolute top-4 left-4 p-2 rounded-lg bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 transition"
        title={isFavorited ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart
          size={20}
          className={isFavorited ? "fill-red-500 text-red-500" : "text-gray-400"}
        />
      </button>

      {/* Header */}
      <div className="mb-6 pt-8">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
              {job.title}
            </h3>
            <p className="text-blue-600 dark:text-blue-400 font-semibold mt-1">
              {job.company}
            </p>
          </div>
        </div>

        {/* Meta Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded font-semibold">
            {job.jobType}
          </span>
          <span className="inline-block px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded font-semibold">
            {job.industry}
          </span>
          {job.remote && (
            <span className="inline-block px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded font-semibold">
              Remote
            </span>
          )}
        </div>
      </div>

      {/* Location and Time */}
      <div className="space-y-2 mb-6 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="flex-shrink-0" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} className="flex-shrink-0" />
          <span>{daysPosted} days ago</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 dark:text-gray-300 mb-6 line-clamp-2 text-sm leading-relaxed">
        {job.description}
      </p>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => onViewDetails(job)}
          className="flex-1 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
        >
          View Details
        </button>
        <button
          onClick={() => handleShare("copy")}
          className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          title="Share job"
        >
          <Share2 size={18} />
        </button>
        <button
          onClick={() => onApply(job)}
          disabled={isApplied}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${
            isApplied
              ? "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg"
          }`}
        >
          {isApplied ? "Applied" : "Apply"}
        </button>
      </div>

      {/* Share Menu */}
      {showShareMenu && (
        <div className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3 flex flex-col gap-2 z-50">
          <button
            onClick={() => handleShare("linkedin")}
            className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-left"
          >
            Share on LinkedIn
          </button>
          <button
            onClick={() => handleShare("twitter")}
            className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-left"
          >
            Share on Twitter
          </button>
          <button
            onClick={() => handleShare("email")}
            className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-left"
          >
            Share via Email
          </button>
        </div>
      )}
    </div>
  );
};

export default SmartJobCard;
