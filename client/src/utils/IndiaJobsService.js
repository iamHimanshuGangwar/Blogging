/**
 * Global Jobs Service
 * Provides real-time job data for locations worldwide
 * Covers major job titles, locations, and salary ranges globally
 */

// Mock global jobs database - In production, connect to global API
const GLOBAL_JOBS = [
  // USA Jobs
  {
    _id: "job-1",
    title: "Senior React Developer",
    company: "Google",
    location: "San Francisco",
    country: "United States",
    salary: "$180,000 - $250,000",
    salaryMin: 180000,
    salaryMax: 250000,
    jobType: "Full-time",
    description: "Build scalable React applications for enterprise clients.",
    skills: ["React", "JavaScript", "Node.js"],
    experience: 5,
    posted: "2 days ago",
    industry: "Technology",
  },
  {
    _id: "job-2",
    title: "Full Stack Developer",
    company: "Meta",
    location: "New York",
    country: "United States",
    salary: "$200,000 - $280,000",
    salaryMin: 200000,
    salaryMax: 280000,
    jobType: "Full-time",
    description: "Develop full-stack e-commerce solutions.",
    skills: ["React", "Python", "PostgreSQL", "AWS"],
    experience: 4,
    posted: "1 day ago",
    industry: "E-commerce",
  },
  {
    _id: "job-3",
    title: "Backend Engineer",
    company: "Amazon",
    location: "Seattle",
    country: "United States",
    salary: "$220,000 - $320,000",
    salaryMin: 220000,
    salaryMax: 320000,
    jobType: "Full-time",
    description: "Build scalable backend systems.",
    skills: ["Java", "Python", "Cloud", "Microservices"],
    experience: 6,
    posted: "3 days ago",
    industry: "Cloud",
  },
  // UK Jobs
  {
    _id: "job-4",
    title: "Data Science Engineer",
    company: "DeepMind",
    location: "London",
    country: "United Kingdom",
    salary: "£120,000 - £180,000",
    salaryMin: 120000,
    salaryMax: 180000,
    jobType: "Full-time",
    description: "Work on ML models and data analytics.",
    skills: ["Python", "Machine Learning", "SQL", "Pandas"],
    experience: 4,
    posted: "2 days ago",
    industry: "AI/ML",
  },
  {
    _id: "job-5",
    title: "Frontend Engineer",
    company: "Farfetch",
    location: "London",
    country: "United Kingdom",
    salary: "£100,000 - £150,000",
    salaryMin: 100000,
    salaryMax: 150000,
    jobType: "Full-time",
    description: "Build luxury e-commerce platforms.",
    skills: ["React", "Vue", "TypeScript"],
    experience: 3,
    posted: "4 days ago",
    industry: "E-commerce",
  },
  // Canada Jobs
  {
    _id: "job-6",
    title: "DevOps Engineer",
    company: "Shopify",
    location: "Toronto",
    country: "Canada",
    salary: "$CAD 140,000 - $CAD 180,000",
    salaryMin: 140000,
    salaryMax: 180000,
    jobType: "Full-time",
    description: "Manage cloud infrastructure and CI/CD pipelines.",
    skills: ["Docker", "Kubernetes", "AWS", "Terraform"],
    experience: 4,
    posted: "5 days ago",
    industry: "Cloud",
  },
  {
    _id: "job-7",
    title: "Machine Learning Engineer",
    company: "Scale AI",
    location: "Vancouver",
    country: "Canada",
    salary: "$CAD 150,000 - $CAD 200,000",
    salaryMin: 150000,
    salaryMax: 200000,
    jobType: "Full-time",
    description: "Develop ML solutions for enterprise.",
    skills: ["Python", "TensorFlow", "Deep Learning"],
    experience: 5,
    posted: "6 days ago",
    industry: "AI/ML",
  },
  // Australia Jobs
  {
    _id: "job-8",
    title: "Senior Full Stack Developer",
    company: "Atlassian",
    location: "Sydney",
    country: "Australia",
    salary: "AUD $160,000 - AUD $220,000",
    salaryMin: 160000,
    salaryMax: 220000,
    jobType: "Full-time",
    description: "Build enterprise collaboration tools.",
    skills: ["Java", "React", "Cloud"],
    experience: 6,
    posted: "3 days ago",
    industry: "Software",
  },
  {
    _id: "job-9",
    title: "UX/UI Designer",
    company: "Canva",
    location: "Sydney",
    country: "Australia",
    salary: "AUD $120,000 - AUD $160,000",
    salaryMin: 120000,
    salaryMax: 160000,
    jobType: "Full-time",
    description: "Design user interfaces for creative tools.",
    skills: ["Figma", "UI/UX", "Design"],
    experience: 3,
    posted: "2 days ago",
    industry: "Design",
  },
  // Germany Jobs
  {
    _id: "job-10",
    title: "Backend Developer",
    company: "SoundCloud",
    location: "Berlin",
    country: "Germany",
    salary: "€90,000 - €130,000",
    salaryMin: 90000,
    salaryMax: 130000,
    jobType: "Full-time",
    description: "Build music streaming infrastructure.",
    skills: ["Go", "Python", "Microservices"],
    experience: 4,
    posted: "1 week ago",
    industry: "Media",
  },
  // India Jobs
  {
    _id: "job-11",
    title: "Senior React Developer",
    company: "TCS",
    location: "Bangalore",
    country: "India",
    salary: "₹12,00,000 - ₹18,00,000",
    salaryMin: 1200000,
    salaryMax: 1800000,
    jobType: "Full-time",
    description: "Build scalable React applications.",
    skills: ["React", "JavaScript", "Node.js"],
    experience: 5,
    posted: "2 days ago",
    industry: "IT Services",
  },
  {
    _id: "job-12",
    title: "Full Stack Developer",
    company: "Flipkart",
    location: "Bangalore",
    country: "India",
    salary: "₹15,00,000 - ₹22,00,000",
    salaryMin: 1500000,
    salaryMax: 2200000,
    jobType: "Full-time",
    description: "Develop full-stack e-commerce solutions.",
    skills: ["React", "Python", "PostgreSQL", "AWS"],
    experience: 4,
    posted: "1 day ago",
    industry: "E-commerce",
  },
  {
    _id: "job-13",
    title: "Data Science Engineer",
    company: "Amazon",
    location: "Hyderabad",
    country: "India",
    salary: "₹13,00,000 - ₹19,00,000",
    salaryMin: 1300000,
    salaryMax: 1900000,
    jobType: "Full-time",
    description: "Work on ML models and data analytics.",
    skills: ["Python", "Machine Learning", "SQL"],
    experience: 4,
    posted: "2 days ago",
    industry: "AI/ML",
  },
  {
    _id: "job-14",
    title: "DevOps Engineer",
    company: "Cognizant",
    location: "Hyderabad",
    country: "India",
    salary: "₹11,00,000 - ₹16,00,000",
    salaryMin: 1100000,
    salaryMax: 1600000,
    jobType: "Full-time",
    description: "Manage cloud infrastructure.",
    skills: ["Docker", "Kubernetes", "AWS"],
    experience: 5,
    posted: "5 days ago",
    industry: "IT Services",
  },
  {
    _id: "job-15",
    title: "Product Manager",
    company: "Unacademy",
    location: "Mumbai",
    country: "India",
    salary: "₹12,00,000 - ₹18,00,000",
    salaryMin: 1200000,
    salaryMax: 1800000,
    jobType: "Full-time",
    description: "Lead product strategy.",
    skills: ["Product Strategy", "Analytics"],
    experience: 6,
    posted: "1 week ago",
    industry: "EdTech",
  },
  // Singapore Jobs
  {
    _id: "job-16",
    title: "Senior DevOps Engineer",
    company: "Grab",
    location: "Singapore",
    country: "Singapore",
    salary: "SGD $120,000 - SGD $180,000",
    salaryMin: 120000,
    salaryMax: 180000,
    jobType: "Full-time",
    description: "Build ride-hailing infrastructure.",
    skills: ["Kubernetes", "GCP", "Cloud"],
    experience: 6,
    posted: "4 days ago",
    industry: "Transportation",
  },
  // Japan Jobs
  {
    _id: "job-17",
    title: "JavaScript Developer",
    company: "Mercari",
    location: "Tokyo",
    country: "Japan",
    salary: "¥6,000,000 - ¥9,000,000",
    salaryMin: 6000000,
    salaryMax: 9000000,
    jobType: "Full-time",
    description: "Build e-commerce platform.",
    skills: ["JavaScript", "TypeScript", "React"],
    experience: 3,
    posted: "3 days ago",
    industry: "E-commerce",
  },
  // UAE Jobs
  {
    _id: "job-18",
    title: "Software Engineer",
    company: "Emirates NBD",
    location: "Dubai",
    country: "UAE",
    salary: "AED 250,000 - AED 400,000",
    salaryMin: 250000,
    salaryMax: 400000,
    jobType: "Full-time",
    description: "Build banking solutions.",
    skills: ["Java", "Spring", "Microservices"],
    experience: 5,
    posted: "2 days ago",
    industry: "Finance",
  },
];

// Global countries and major cities
export const GLOBAL_LOCATIONS = [
  { country: "United States", cities: ["San Francisco", "New York", "Seattle", "Austin", "Denver"] },
  { country: "United Kingdom", cities: ["London", "Manchester", "Birmingham", "Bristol"] },
  { country: "Canada", cities: ["Toronto", "Vancouver", "Montreal", "Calgary"] },
  { country: "Australia", cities: ["Sydney", "Melbourne", "Brisbane", "Perth"] },
  { country: "Germany", cities: ["Berlin", "Munich", "Hamburg", "Cologne"] },
  { country: "France", cities: ["Paris", "Lyon", "Marseille"] },
  { country: "India", cities: ["Bangalore", "Hyderabad", "Mumbai", "Delhi", "Pune", "Gurgaon"] },
  { country: "Singapore", cities: ["Singapore"] },
  { country: "Japan", cities: ["Tokyo", "Osaka", "Kyoto"] },
  { country: "UAE", cities: ["Dubai", "Abu Dhabi"] },
  { country: "Netherlands", cities: ["Amsterdam", "Rotterdam"] },
  { country: "Sweden", cities: ["Stockholm", "Gothenburg"] },
];

export const IndiaJobsService = {
  /**
   * Search jobs with filters
   * @param {Object} filters - Search filters
   * @returns {Object} { success, data, count }
   */
  searchJobs(filters = {}) {
    let results = [...GLOBAL_JOBS];

    // Filter by query (job title or company)
    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter(
        job =>
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query)
      );
    }

    // Filter by location
    if (filters.location) {
      const location = filters.location.toLowerCase();
      results = results.filter(
        job =>
          job.location.toLowerCase().includes(location) ||
          job.country.toLowerCase().includes(location)
      );
    }

    // Filter by job type
    if (filters.jobType && filters.jobType !== "All") {
      results = results.filter(job => job.jobType === filters.jobType);
    }

    // Filter by salary range
    if (filters.salaryMin || filters.salaryMax) {
      const min = filters.salaryMin || 0;
      const max = filters.salaryMax || Infinity;
      results = results.filter(
        job => job.salaryMin >= min && job.salaryMax <= max
      );
    }

    // Filter by industry
    if (filters.industry && filters.industry !== "All") {
      results = results.filter(job => job.industry === filters.industry);
    }

    return {
      success: true,
      data: results,
      count: results.length,
    };
  },

  /**
   * Get all unique job types
   * @returns {Array} Job types
   */
  getJobTypes() {
    const types = [...new Set(GLOBAL_JOBS.map(job => job.jobType))];
    return types;
  },

  /**
   * Get all unique cities (for backward compatibility)
   * @returns {Array} Cities
   */
  getCities() {
    const cities = [...new Set(GLOBAL_JOBS.map(job => job.location))];
    return cities;
  },

  /**
   * Get all unique countries
   * @returns {Array} Countries
   */
  getCountries() {
    const countries = [...new Set(GLOBAL_JOBS.map(job => job.country))];
    return countries;
  },

  /**
   * Get jobs by location
   * @param {string} location - Location name
   * @returns {Array} Matching jobs
   */
  getJobsByLocation(location) {
    return GLOBAL_JOBS.filter(
      job =>
        job.location.toLowerCase().includes(location.toLowerCase()) ||
        job.country.toLowerCase().includes(location.toLowerCase())
    );
  },

  /**
   * Get jobs by country
   * @param {string} country - Country name
   * @returns {Array} Matching jobs
   */
  getJobsByCountry(country) {
    return GLOBAL_JOBS.filter(
      job => job.country.toLowerCase() === country.toLowerCase()
    );
  },

  /**
   * Get jobs by job type
   * @param {string} type - Job type
   * @returns {Array} Matching jobs
   */
  getJobsByType(type) {
    return GLOBAL_JOBS.filter(
      job => job.jobType.toLowerCase() === type.toLowerCase()
    );
  },

  /**
   * Get jobs by industry
   * @param {string} industry - Industry name
   * @returns {Array} Matching jobs
   */
  getJobsByIndustry(industry) {
    return GLOBAL_JOBS.filter(
      job => job.industry.toLowerCase().includes(industry.toLowerCase())
    );
  },

  /**
   * Get jobs by salary range
   * @param {number} min - Minimum salary
   * @param {number} max - Maximum salary
   * @returns {Array} Jobs in range
   */
  getJobsBySalary(min, max) {
    return GLOBAL_JOBS.filter(
      job => job.salaryMin >= min && job.salaryMax <= max
    );
  },

  /**
   * Get jobs by skill match
   * @param {Array} skills - User skills
   * @returns {Array} Matching jobs sorted by match score
   */
  getJobsBySkills(userSkills = []) {
    return GLOBAL_JOBS.map(job => {
      const matchedSkills = job.skills.filter(skill =>
        userSkills.some(us =>
          us.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(us.toLowerCase())
        )
      );

      const matchScore = userSkills.length > 0
        ? (matchedSkills.length / job.skills.length) * 100
        : 0;

      return {
        ...job,
        matchedSkills,
        matchScore: Math.round(matchScore),
      };
    })
      .filter(job => job.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);
  },

  /**
   * Get trending jobs (most common titles)
   * @returns {Array} Top jobs
   */
  getTrendingJobs() {
    const jobTitles = {};
    GLOBAL_JOBS.forEach(job => {
      jobTitles[job.title] = (jobTitles[job.title] || 0) + 1;
    });

    return Object.keys(jobTitles)
      .sort((a, b) => jobTitles[b] - jobTitles[a])
      .slice(0, 10);
  },

  /**
   * Get salary statistics by job title
   * @param {string} jobTitle - Job title
   * @returns {Object} Salary stats
   */
  getSalaryStats(jobTitle) {
    const jobs = GLOBAL_JOBS.filter(j =>
      j.title.toLowerCase().includes(jobTitle.toLowerCase())
    );

    if (jobs.length === 0) return null;

    const salaries = jobs.map(j => j.salaryMin);
    const avgSalary = salaries.reduce((a, b) => a + b, 0) / salaries.length;

    return {
      minimum: Math.min(...salaries),
      maximum: Math.max(...salaries),
      average: Math.round(avgSalary),
      count: jobs.length,
    };
  },

  /**
   * Get all jobs
   * @returns {Array} All jobs
   */
  getAllJobs() {
    return GLOBAL_JOBS;
  },
};
