import React, { useState } from "react";
import {
  TrendingUp,
  Briefcase,
  MapPin,
  DollarSign,
  Check,
  AlertCircle,
} from "lucide-react";
import "./ResumeJobMatcher.css";

/**
 * Resume-Based Job Matcher Component
 * Displays jobs matched to user's resume with match scores
 * Shows skills alignment, experience fit, and recommendations
 */
const ResumeJobMatcher = ({ jobs = [], resumeProfile = null, onJobSelect = () => {} }) => {
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [sortBy, setSortBy] = useState("match"); // match, salary, recent

  if (!resumeProfile) {
    return (
      <div className="resume-job-matcher empty-state">
        <AlertCircle size={40} />
        <p>Upload a resume to see matched jobs</p>
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="resume-job-matcher empty-state">
        <Briefcase size={40} />
        <p>No jobs available</p>
      </div>
    );
  }

  // Sort jobs
  const sortedJobs = [...jobs].sort((a, b) => {
    if (sortBy === "match") {
      return (b.matchScore || 0) - (a.matchScore || 0);
    } else if (sortBy === "salary") {
      return (b.salaryMax || 0) - (a.salaryMax || 0);
    }
    return 0;
  });

  const getMatchColor = (score) => {
    if (score >= 80) return "high";
    if (score >= 60) return "medium";
    return "low";
  };

  const getMatchLabel = (score) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Great";
    if (score >= 70) return "Good";
    if (score >= 60) return "Fair";
    return "Low Match";
  };

  return (
    <div className="resume-job-matcher">
      {/* Header */}
      <div className="matcher-header">
        <div className="matcher-title">
          <TrendingUp size={24} />
          <div>
            <h3>Jobs Matched to Your Resume</h3>
            <p>{sortedJobs.length} opportunities found</p>
          </div>
        </div>

        {/* Sort Options */}
        <div className="sort-options">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="match">Best Match</option>
            <option value="salary">Highest Salary</option>
            <option value="recent">Most Recent</option>
          </select>
        </div>
      </div>

      {/* Jobs List */}
      <div className="jobs-matched-list">
        {sortedJobs.map((job, idx) => (
          <div
            key={job._id || idx}
            className={`job-card-matched ${getMatchColor(job.matchScore || 0)} ${
              selectedJobId === job._id ? "selected" : ""
            }`}
            onClick={() => {
              setSelectedJobId(job._id);
              onJobSelect(job);
            }}
          >
            {/* Match Score Badge */}
            <div className="match-badge">
              <div className="score-circle">
                <span className="score-number">{Math.round(job.matchScore || 0)}</span>
                <span className="score-label">%</span>
              </div>
              <div className="match-label">{getMatchLabel(job.matchScore || 0)}</div>
            </div>

            {/* Job Info */}
            <div className="job-info-matched">
              <div className="job-header-matched">
                <h4>{job.title}</h4>
                <span className="company-tag">{job.company}</span>
              </div>

              <div className="job-details-matched">
                <div className="detail-item">
                  <MapPin size={14} />
                  {job.location}
                </div>
                <div className="detail-item">
                  <DollarSign size={14} />
                  {job.salary}
                </div>
              </div>

              {/* Match Details */}
              {job.matchDetails && (
                <div className="match-details">
                  <div className="match-detail-item">
                    <Check size={14} className="check-icon" />
                    <span>
                      {job.matchDetails.matchedSkills}/{job.matchDetails.requiredSkills} skills matched
                    </span>
                  </div>
                  <div className="match-detail-item">
                    <Check size={14} className="check-icon" />
                    <span>
                      {job.matchDetails.experience} years experience (need {job.matchDetails.requiredExperience})
                    </span>
                  </div>
                </div>
              )}

              {/* Skills Preview */}
              {job.matchedSkills && job.matchedSkills.length > 0 && (
                <div className="skills-preview">
                  {job.matchedSkills.slice(0, 3).map((skill, i) => (
                    <span key={i} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                  {job.matchedSkills.length > 3 && (
                    <span className="skill-tag more">+{job.matchedSkills.length - 3}</span>
                  )}
                </div>
              )}

              {/* Action Button */}
              <button className="apply-btn-matched">
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="matcher-stats">
        <div className="stat-item high">
          <div className="stat-number">
            {sortedJobs.filter(j => (j.matchScore || 0) >= 80).length}
          </div>
          <div className="stat-label">Excellent Matches</div>
        </div>
        <div className="stat-item medium">
          <div className="stat-number">
            {sortedJobs.filter(j => (j.matchScore || 0) >= 60 && (j.matchScore || 0) < 80).length}
          </div>
          <div className="stat-label">Good Matches</div>
        </div>
        <div className="stat-item low">
          <div className="stat-number">
            {sortedJobs.filter(j => (j.matchScore || 0) < 60).length}
          </div>
          <div className="stat-label">Potential</div>
        </div>
      </div>
    </div>
  );
};

export default ResumeJobMatcher;
