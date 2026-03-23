/**
 * Adzuna Job Search Service
 * Handles real-time job search using Adzuna API
 * No sensitive keys stored in frontend - calls through backend proxy
 */

const ADZUNA_API_BASE = "/api/adzuna"; // Backend proxy endpoint

export const AdzunaService = {
  /**
   * Search jobs with Adzuna API
   * @param {Object} params - Search parameters
   * @param {string} params.query - Job title/keyword (e.g., "React Developer")
   * @param {string} params.location - Job location (e.g., "London")
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.maxResults - Results per page (default: 20, max: 50)
   * @returns {Promise} Job search results
   */
  async searchJobs(params = {}) {
    try {
      const {
        query = "developer",
        location = "gb",
        page = 1,
        maxResults = 25,
      } = params;

      // Validate inputs
      if (!query || query.trim() === "") {
        console.warn("[AdzunaService] Empty query, using default");
      }

      // Build query string
      const queryParams = new URLSearchParams({
        query: query || "developer",
        location: location || "gb",
        page: page || 1,
        results_per_page: Math.min(maxResults, 50),
        sort_by: "date",
      });

      const url = `${ADZUNA_API_BASE}/search?${queryParams.toString()}`;
      console.log("[AdzunaService] Fetching from:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });

      console.log("[AdzunaService] Response Status:", response.status);
      console.log("[AdzunaService] Content-Type:", response.headers.get("content-type"));

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("[AdzunaService] Non-JSON response:", text?.substring(0, 200));
        throw new Error(`Invalid response format: ${contentType}`);
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log("[AdzunaService] Success! Got", data.data?.length || 0, "jobs");
      
      return {
        success: true,
        data: data.data || [],
        total: data.total || 0,
      };
    } catch (error) {
      console.error("[AdzunaService] Search error:", error.message);
      console.warn("[AdzunaService] Returning fallback mock data...");
      return this.getMockJobs(params);
    }
  },

  /**
   * Get mock/fallback jobs when API fails
   * @returns Mock job data for testing
   */
  getMockJobs(params = {}) {
    const { query = "developer", location = "gb" } = params;
    
    const mockJobs = [
      {
        _id: "mock-1",
        title: "Senior React Developer",
        company: "TechCorp Solutions",
        location: "London, UK",
        salary: "£70,000 - £90,000",
        salaryMin: 70000,
        salaryMax: 90000,
        description: "We are looking for an experienced React developer to join our growing team.",
        jobType: "Permanent",
        industry: "Technology",
        posted: new Date(),
        source: "mock",
      },
      {
        _id: "mock-2",
        title: "Full Stack Developer",
        company: "StartUp XYZ",
        location: "Remote, UK",
        salary: "£50,000 - £70,000",
        salaryMin: 50000,
        salaryMax: 70000,
        description: "Join our startup building innovative solutions with modern tech stack.",
        jobType: "Permanent",
        industry: "Technology",
        posted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        source: "mock",
      },
      {
        _id: "mock-3",
        title: "Backend Engineer",
        company: "Enterprise Systems Inc",
        location: "Manchester, UK",
        salary: "£60,000 - £80,000",
        salaryMin: 60000,
        salaryMax: 80000,
        description: "Enterprise solutions company seeks backend expertise in microservices.",
        jobType: "Permanent",
        industry: "Technology",
        posted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        source: "mock",
      },
    ];

    return {
      success: true,
      data: mockJobs,
      total: mockJobs.length,
    };
  },

  /**
   * Get top companies hiring
   * @returns {Promise} List of trending companies
   */
  async getTrendingCompanies() {
    try {
      const response = await fetch(`${ADZUNA_API_BASE}/trending-companies`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Trending companies error:", error);
      throw error;
    }
  },

  /**
   * Get category statistics
   * @returns {Promise} Job categories with counts
   */
  async getCategoryStats() {
    try {
      const response = await fetch(`${ADZUNA_API_BASE}/categories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Category stats error:", error);
      throw error;
    }
  },

  /**
   * Get job details
   * @param {string} jobId - Adzuna job ID
   * @returns {Promise} Job details
   */
  async getJobDetails(jobId) {
    try {
      const response = await fetch(`${ADZUNA_API_BASE}/jobs/${jobId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Job details error:", error);
      throw error;
    }
  },

  /**
   * Get salary insights for a role
   * @param {string} role - Job role/title
   * @param {string} location - Location
   * @returns {Promise} Salary data
   */
  async getSalaryInsights(role, location) {
    try {
      const response = await fetch(
        `${ADZUNA_API_BASE}/salary?role=${encodeURIComponent(role)}&location=${encodeURIComponent(
          location
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Salary insights error:", error);
      throw error;
    }
  },
};

export default AdzunaService;
