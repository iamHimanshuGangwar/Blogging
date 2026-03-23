/**
 * Currency Conversion Utilities
 * Convert between USD and INR (Indian Rupees)
 */

// Exchange rate: 1 USD = ~84 INR (approximate)
const EXCHANGE_RATE = 84;

/**
 * Convert USD to INR
 * @param {number} usd - Amount in USD
 * @returns {number} Amount in INR
 */
export const usdToINR = (usd) => {
  if (!usd || isNaN(usd)) return 0;
  return Math.round(usd * EXCHANGE_RATE);
};

/**
 * Convert INR to USD
 * @param {number} inr - Amount in INR
 * @returns {number} Amount in USD
 */
export const inrToUSD = (inr) => {
  if (!inr || isNaN(inr)) return 0;
  return Math.round(inr / EXCHANGE_RATE);
};

/**
 * Format salary range in both USD and INR
 * @param {object} salary - Salary object with min and max
 * @returns {string} Formatted salary string
 */
export const formatSalaryRange = (salary) => {
  if (!salary) return "Not specified";

  const formatAmount = (amount) => {
    if (!amount) return null;
    if (amount >= 1000) {
      return (amount / 1000).toFixed(0) + "K";
    }
    return amount.toString();
  };

  const usdMin = salary.min ? formatAmount(salary.min) : null;
  const usdMax = salary.max ? formatAmount(salary.max) : null;

  const inrMin = salary.min ? formatAmount(usdToINR(salary.min)) : null;
  const inrMax = salary.max ? formatAmount(usdToINR(salary.max)) : null;

  let result = "";

  if (usdMin && usdMax) {
    result = `$${usdMin} - $${usdMax}`;
  } else if (usdMin) {
    result = `$${usdMin}+`;
  } else if (usdMax) {
    result = `$${usdMax}`;
  }

  if (inrMin && inrMax) {
    result += ` / ₹${inrMin} - ₹${inrMax}`;
  } else if (inrMin) {
    result += ` / ₹${inrMin}+`;
  } else if (inrMax) {
    result += ` / ₹${inrMax}`;
  }

  return result || "Competitive";
};

/**
 * Format single salary amount in both currencies
 * @param {number} amount - Amount in USD (thousands)
 * @returns {string} Formatted salary string
 */
export const formatSingleSalary = (amount) => {
  if (!amount || isNaN(amount)) return "Not specified";

  const amountK = `${amount}K`;
  const inrAmount = usdToINR(amount * 1000);
  const inrAmountK = formatAmount(inrAmount);

  return `$${amountK} / ₹${inrAmountK}`;
};

const formatAmount = (amount) => {
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1) + "M";
  } else if (amount >= 1000) {
    return (amount / 1000).toFixed(0) + "K";
  }
  return amount.toString();
};

/**
 * Get salary in specific format for display
 * @param {object} job - Job object with salary information
 * @param {string} format - Format: 'full', 'short', or 'detailed'
 * @returns {string} Formatted salary
 */
export const getJobSalary = (job, format = "full") => {
  if (!job) return "Not specified";

  // If job has pre-formatted salary string
  if (job.salary && typeof job.salary === "string") {
    return job.salary;
  }

  // If job has salary object
  if (job.salary && typeof job.salary === "object") {
    return formatSalaryRange(job.salary);
  }

  // If job has salaryMin and salaryMax
  if (job.salaryMin || job.salaryMax) {
    return formatSalaryRange({
      min: job.salaryMin,
      max: job.salaryMax,
    });
  }

  return "Competitive";
};
