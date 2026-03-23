import axios from "axios";

// Location to country code mapping
const LOCATION_COUNTRY_MAP = {
  // India
  noida: "in",
  delhi: "in",
  "dehli": "in", // Common typo
  "new delhi": "in",
  "new dehli": "in",
  mumbai: "in",
  bangalore: "in",
  "bengaluru": "in",
  hyderabad: "in",
  pune: "in",
  kolkata: "in",
  chandigarh: "in",
  ahmedabad: "in",
  jaipur: "in",
  lucknow: "in",
  kanpur: "in",
  indore: "in",
  surat: "in",
  kochi: "in",
  visakhapatnam: "in",
  nagpur: "in",
  bhopal: "in",
  chandigarh: "in",
  gurgaon: "in",
  gurugram: "in",
  
  // UK
  london: "gb",
  manchester: "gb",
  birmingham: "gb",
  leeds: "gb",
  glasgow: "gb",
  
  // USA
  "new york": "us",
  "san francisco": "us",
  "los angeles": "us",
  chicago: "us",
  seattle: "us",
  boston: "us",
  
  // Other countries
  toronto: "ca",
  vancouver: "ca",
  sydney: "au",
};

const getCountryCode = (location) => {
  if (!location) return "gb";
  const normalized = location.toLowerCase().trim();
  return LOCATION_COUNTRY_MAP[normalized] || "in"; // Default to India for Indian cities
};

const ADZUNA_API_HOST = "https://api.adzuna.com/v1/api/jobs";
const ADZUNA_API_ID = process.env.ADZUNA_API_ID;
const ADZUNA_API_KEY = process.env.ADZUNA_API_KEY; // Fixed typo: was ADZUNE_API_KEY

/**
 * Search jobs using Adzuna API
 * GET /api/adzuna/search
 */
export const searchJobs = async (req, res) => {
  try {
    const {
      query = "developer",
      location = "",
      page = 1,
      results_per_page = 20,
      job_type,
      salary_min,
      salary_max,
      full_time,
    } = req.query;

    // Validate API credentials
    if (!ADZUNA_API_ID || !ADZUNA_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Adzuna API credentials not configured",
      });
    }

    // Get country code from location name
    const country = getCountryCode(location);
    let url = `${ADZUNA_API_HOST}/${country}/search/${page}?app_id=${ADZUNA_API_ID}&app_key=${ADZUNA_API_KEY}&results_per_page=${results_per_page}&what=${encodeURIComponent(
      query
    )}`;

    // Add optional parameters
    if (location) url += `&where=${encodeURIComponent(location)}`;
    if (job_type) url += `&job_type=${encodeURIComponent(job_type)}`;
    if (salary_min) url += `&salary_min=${salary_min}`;
    if (salary_max) url += `&salary_max=${salary_max}`;
    if (full_time) url += `&full_time=${full_time}`;

    console.log("[ADZUNA] Searching jobs with URL:", url.split("app_key")[0] + "app_key=***");

    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        "User-Agent": "AiBlog-JobPortal/1.0",
      },
    });

    if (response.data) {
      // Transform Adzuna results to match our format
      const transformedJobs = response.data.results.map((job) => ({
        _id: job.id || `adzuna-${job.job_id}`,
        title: job.title,
        company: job.company.display_name,
        location: `${job.location.display_name}`,
        salary: job.salary_is_predicted
          ? `£${job.salary_min}-£${job.salary_max} (estimated)`
          : job.salary_max
          ? `£${job.salary_min}-£${job.salary_max}`
          : "Salary not specified",
        salaryMin: job.salary_min || 0,
        salaryMax: job.salary_max || 0,
        description: job.description,
        jobType: job.contract_type || "Permanent",
        industry: "Technology", // Default, could be enhanced
        url: job.redirect_url,
        posted: new Date(job.created),
        source: "adzuna",
        jobId: job.job_id,
      }));

      return res.json({
        success: true,
        data: transformedJobs,
        total: response.data.count,
        page: page,
        resultsPerPage: results_per_page,
      });
    }

    throw new Error("No data returned from Adzuna");
  } catch (error) {
    console.error("[ADZUNA ERROR]", error.message);
    console.error("[ADZUNA ERROR] Full error:", error);

    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: "Invalid Adzuna API credentials - check your API ID and Key",
        errorCode: "INVALID_CREDENTIALS",
      });
    }

    if (error.response?.status === 403) {
      return res.status(403).json({
        success: false,
        message: "Adzuna API access forbidden - credentials may be expired",
        errorCode: "FORBIDDEN",
      });
    }

    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({
        success: false,
        message: "Cannot connect to Adzuna API - check your internet connection",
        errorCode: "CONNECTION_ERROR",
      });
    }

    if (error.code === "ENOTFOUND") {
      return res.status(503).json({
        success: false,
        message: "Adzuna API host not found - DNS resolution failed",
        errorCode: "HOST_NOT_FOUND",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to search jobs",
      error: error.message,
      hint: "Check browser console for more details. Run /api/adzuna/health to verify configuration.",
    });
  }
};

/**
 * Get salary insights
 * GET /api/adzuna/salary
 */
export const getSalaryInsights = async (req, res) => {
  try {
    const { role = "Developer", location = "gb" } = req.query;

    if (!ADZUNA_API_ID || !ADZUNA_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Adzuna API credentials not configured",
      });
    }

    // Salary endpoint
    const url = `${ADZUNA_API_HOST}/${location}/top_companies?app_id=${ADZUNA_API_ID}&app_key=${ADZUNA_API_KEY}&what=${encodeURIComponent(
      role
    )}`;

    const response = await axios.get(url, {
      timeout: 10000,
    });

    return res.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("[ADZUNA SALARY ERROR]", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to get salary insights",
      error: error.message,
    });
  }
};

/**
 * Get trending companies
 * GET /api/adzuna/trending-companies
 */
export const getTrendingCompanies = async (req, res) => {
  try {
    const { location = "gb" } = req.query;

    if (!ADZUNA_API_ID || !ADZUNA_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Adzuna API credentials not configured",
      });
    }

    const url = `https://api.adzuna.com/v1/api/jobs/${location}/companies?app_id=${ADZUNA_API_ID}&app_key=${ADZUNA_API_KEY}`;

    const response = await axios.get(url, {
      timeout: 10000,
    });

    return res.json({
      success: true,
      data: response.data.leaderboard || [],
    });
  } catch (error) {
    console.error("[ADZUNA COMPANIES ERROR]", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to get trending companies",
      error: error.message,
    });
  }
};

/**
 * Get category statistics
 * GET /api/adzuna/categories
 */
export const getCategories = async (req, res) => {
  try {
    const { location = "gb" } = req.query;

    if (!ADZUNA_API_ID || !ADZUNA_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Adzuna API credentials not configured",
      });
    }

    const url = `https://api.adzuna.com/v1/api/jobs/${location}/categories?app_id=${ADZUNA_API_ID}&app_key=${ADZUNA_API_KEY}`;

    const response = await axios.get(url, {
      timeout: 10000,
    });

    return res.json({
      success: true,
      data: response.data.results || [],
    });
  } catch (error) {
    console.error("[ADZUNA CATEGORIES ERROR]", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to get categories",
      error: error.message,
    });
  }
};

/**
 * Get job details
 * GET /api/adzuna/jobs/:jobId
 */
export const getJobDetails = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { location = "gb" } = req.query;

    if (!ADZUNA_API_ID || !ADZUNA_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Adzuna API credentials not configured",
      });
    }

    const url = `https://api.adzuna.com/v1/api/jobs/${location}/${jobId}?app_id=${ADZUNA_API_ID}&app_key=${ADZUNA_API_KEY}`;

    const response = await axios.get(url, {
      timeout: 10000,
    });

    return res.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("[ADZUNA JOB DETAILS ERROR]", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to get job details",
      error: error.message,
    });
  }
};

/**
 * Health Check - Test API credentials and connectivity
 * GET /api/adzuna/health
 */
export const healthCheck = async (req, res) => {
  try {
    const checks = {
      credentialsConfigured: !!ADZUNA_API_ID && !!ADZUNA_API_KEY,
      apiId: ADZUNA_API_ID ? "✓ Configured" : "✗ Missing",
      apiKey: ADZUNA_API_KEY ? "✓ Configured" : "✗ Missing",
    };

    if (!checks.credentialsConfigured) {
      return res.status(400).json({
        success: false,
        status: "Configuration Error",
        checks,
        message: "Adzuna API credentials not configured in .env file",
        required: ["ADZUNA_API_ID", "ADZUNA_API_KEY"],
        help: "Check your server/.env file has both ADZUNA_API_ID and ADZUNA_API_KEY set",
      });
    }

    // Test API connection
    const testUrl = `https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=${ADZUNA_API_ID}&app_key=${ADZUNA_API_KEY}&results_per_page=1&what=test`;

    console.log("[HEALTH CHECK] Testing API connection...");

    const response = await axios.get(testUrl, {
      timeout: 5000,
      headers: {
        "User-Agent": "AiBlog-JobPortal/1.0",
      },
    });

    checks.apiConnection = "✓ Connected";
    checks.responseTime = "< 5s";
    checks.sampleResult = response.data.count ? `✓ Got ${response.data.count} jobs` : "✓ API Responding";

    return res.json({
      success: true,
      status: "Healthy",
      checks,
      message: "Adzuna API is properly configured and responding",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[HEALTH CHECK ERROR]", error.message);

    const errorInfo = {
      credentialsConfigured: !!ADZUNA_API_ID && !!ADZUNA_API_KEY,
      apiId: ADZUNA_API_ID ? "✓ Configured" : "✗ Missing",
      apiKey: ADZUNA_API_KEY ? "✓ Configured" : "✗ Missing",
      apiConnection: "✗ Failed",
      errorType: error.code || error.status || "Unknown",
      errorMessage: error.message,
    };

    if (error.response?.status === 401) {
      errorInfo.issue = "Invalid API credentials - check your API ID and Key";
    } else if (error.code === "ECONNREFUSED") {
      errorInfo.issue = "Cannot connect to Adzuna - check internet connection";
    } else if (error.code === "ENOTFOUND") {
      errorInfo.issue = "DNS resolution failed - cannot reach api.adzuna.com";
    } else {
      errorInfo.issue = error.message;
    }

    return res.status(503).json({
      success: false,
      status: "Unhealthy",
      checks: errorInfo,
      message: "Adzuna API is not working properly",
      help: "Run this endpoint again to get updated diagnostics",
      timestamp: new Date().toISOString(),
    });
  }
};
