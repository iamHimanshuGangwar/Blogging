import React, { useState, useEffect } from "react";
import { Search, Loader, AlertCircle, MapPin, Briefcase, DollarSign } from "lucide-react";
import { useNotifications } from "../../context/NotificationsContext";
import AdzunaService from "../../utils/AdzunaService";
import toast from "react-hot-toast";
import "./AdzunaRealTimeSearch.css";

/**
 * Adzuna Real-Time Job Search Component
 * Features:
 * - Real-time search powered by Adzuna API
 * - Auto-complete suggestions
 * - Persistent job notifications
 * - Popular searches
 */
const AdzunaRealTimeSearch = ({ onJobsFound = () => {}, onSearch = () => {} }) => {
  const { addSearchAlert, addJobAlert } = useNotifications();

  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("London");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState(null);
  const [popularSearches] = useState([
    "React Developer",
    "Senior Engineer",
    "Product Manager",
    "UI/UX Designer",
    "DevOps Engineer",
    "Data Scientist",
    "Full Stack Developer",
  ]);

  /**
   * Perform Adzuna search
   */
  const handleSearch = async (e) => {
    e?.preventDefault();

    if (!searchQuery.trim()) {
      toast.error("Please enter a job title or keyword");
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const response = await AdzunaService.searchJobs({
        query: searchQuery,
        location: location,
        page: 1,
        maxResults: 25,
      });

      if (response.success && response.data) {
        setResults(response.data);
        setShowSuggestions(false);

        // Show notification
        addSearchAlert(searchQuery, response.data.length);

        // Trigger callback
        onJobsFound(response.data);
        onSearch({
          query: searchQuery,
          location: location,
          results: response.data.length,
        });

        // Add individual job alerts for top 3 results
        response.data.slice(0, 3).forEach((job) => {
          addJobAlert(job, `New job found: ${job.title} at ${job.company}`);
        });

        toast.success(`Found ${response.data.length} jobs! 🎉`);
      } else {
        setError("No jobs found. Try different keywords or location.");
        toast.info("No jobs found with those criteria");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to search jobs. Please try again.");
      toast.error("Search failed - check your internet connection");
    } finally {
      setIsSearching(false);
    }
  };

  /**
   * Handle popular search click
   */
  const handlePopularSearch = (searchTerm) => {
    setSearchQuery(searchTerm);
    setShowSuggestions(false);
    // Trigger search after setting query
    setTimeout(() => {
      handleSearch();
    }, 0);
  };

  return (
    <div className="adzuna-search-container">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="adzuna-search-form">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search by job title, keyword..."
            className="search-input"
            disabled={isSearching}
          />
          {isSearching && (
            <Loader className="search-loader animate-spin" size={20} />
          )}
        </div>

        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location (e.g., London, UK)"
          className="location-input"
          disabled={isSearching}
        />

        <button
          type="submit"
          disabled={isSearching}
          className="search-button"
        >
          {isSearching ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Suggestions / Popular Searches */}
      {showSuggestions && (
        <div className="search-suggestions">
          <p className="suggestions-title">Popular Searches</p>
          <div className="suggestions-grid">
            {popularSearches.map((search, idx) => (
              <button
                key={idx}
                onClick={() => handlePopularSearch(search)}
                className="suggestion-chip"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <AlertCircle size={18} />
          <p>{error}</p>
        </div>
      )}

      {/* Results Preview */}
      {results.length > 0 && (
        <div className="search-results">
          <h3 className="results-title">
            Found {results.length} jobs - Top Results
          </h3>
          <div className="results-list">
            {results.slice(0, 5).map((job, idx) => (
              <div key={idx} className="result-item">
                <div className="result-header">
                  <h4>{job.title}</h4>
                  <span className="company-badge">{job.company}</span>
                </div>
                <div className="result-details">
                  <div className="detail">
                    <MapPin size={14} />
                    <span>{job.location}</span>
                  </div>
                  <div className="detail">
                    <DollarSign size={14} />
                    <span>{job.salary}</span>
                  </div>
                  <div className="detail">
                    <Briefcase size={14} />
                    <span>{job.jobType}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdzunaRealTimeSearch;
