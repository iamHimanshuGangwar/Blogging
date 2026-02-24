/**
 * Resume Parser Utility
 * Extracts information from resume text/PDF using AI-powered pattern matching
 * Supports: PDF text, plain text, docx conversion
 */

class ResumeParser {
  constructor() {
    this.skillDatabase = {
      frontend: [
        "React",
        "Vue",
        "Angular",
        "Svelte",
        "Next.js",
        "Gatsby",
        "TypeScript",
        "JavaScript",
        "HTML",
        "CSS",
        "Tailwind",
        "Bootstrap",
        "Material UI",
        "Three.js",
        "WebGL",
      ],
      backend: [
        "Node.js",
        "Python",
        "Express",
        "Django",
        "Flask",
        "FastAPI",
        "Java",
        "Spring Boot",
        "C#",
        ".NET",
        "Ruby",
        "Rails",
        "Go",
        "Rust",
        "PHP",
        "Laravel",
      ],
      database: [
        "MongoDB",
        "PostgreSQL",
        "MySQL",
        "Redis",
        "Elasticsearch",
        "Cassandra",
        "Firebase",
        "Supabase",
        "DynamoDB",
        "Oracle",
        "SQL Server",
      ],
      devops: [
        "Docker",
        "Kubernetes",
        "AWS",
        "Azure",
        "GCP",
        "CI/CD",
        "Jenkins",
        "GitLab",
        "GitHub Actions",
        "Terraform",
        "Ansible",
        "Linux",
      ],
      soft: [
        "Leadership",
        "Communication",
        "Problem Solving",
        "Teamwork",
        "Project Management",
        "Agile",
        "Scrum",
        "Mentoring",
      ],
    };

    // Experience level keywords
    this.experienceLevels = {
      junior: ["junior", "entry", "0-2 years", "graduate"],
      mid: ["mid", "3-5 years", "intermediate"],
      senior: ["senior", "lead", "5-10 years", "principal"],
      executive: ["director", "vp", "cto", "10+ years"],
    };
  }

  /**
   * Parse resume file (PDF text or plain text)
   * @param {string} resumeText - Raw resume text
   * @returns {Object} Parsed resume data
   */
  parseResume(resumeText) {
    if (!resumeText || typeof resumeText !== "string") {
      return this.getEmptyResume();
    }

    const text = resumeText.toLowerCase();
    const lines = resumeText.split("\n");

    return {
      fullName: this.extractName(lines),
      email: this.extractEmail(resumeText),
      phone: this.extractPhone(resumeText),
      skills: this.extractSkills(text),
      experienceLevel: this.detectExperienceLevel(text),
      yearsOfExperience: this.extractYearsOfExperience(text),
      industries: this.detectIndustries(text),
      rawText: resumeText,
      summary: this.generateSummary(resumeText),
    };
  }

  /**
   * Extract candidate name (usually first meaningful line)
   */
  extractName(lines) {
    for (const line of lines) {
      const trimmed = line.trim();
      if (
        trimmed.length > 2 &&
        trimmed.length < 100 &&
        !trimmed.includes("@") &&
        trimmed.match(/^[a-zA-Z\s]+$/)
      ) {
        return trimmed;
      }
    }
    return "Candidate";
  }

  /**
   * Extract email address using regex
   */
  extractEmail(text) {
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
    const matches = text.match(emailRegex);
    return matches ? matches[0] : null;
  }

  /**
   * Extract phone number using regex
   */
  extractPhone(text) {
    const phoneRegex =
      /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
    const matches = text.match(phoneRegex);
    return matches ? matches[0] : null;
  }

  /**
   * Extract all skills from resume
   * Detects tech stack across all categories
   */
  extractSkills(text) {
    const foundSkills = {
      frontend: [],
      backend: [],
      database: [],
      devops: [],
      soft: [],
    };

    // Search each category
    for (const [category, skills] of Object.entries(this.skillDatabase)) {
      for (const skill of skills) {
        const skillRegex = new RegExp(`\\b${skill}\\b`, "gi");
        if (skillRegex.test(text)) {
          foundSkills[category].push(skill);
        }
      }
    }

    return foundSkills;
  }

  /**
   * Detect experience level from resume keywords
   */
  detectExperienceLevel(text) {
    for (const [level, keywords] of Object.entries(this.experienceLevels)) {
      for (const keyword of keywords) {
        if (text.includes(keyword.toLowerCase())) {
          return level;
        }
      }
    }

    // If found any strong keywords, infer from years
    const yearsMatch = text.match(/(\d+)\+?\s*(?:years?|yrs?)/i);
    if (yearsMatch) {
      const years = parseInt(yearsMatch[1]);
      if (years < 2) return "junior";
      if (years < 5) return "mid";
      if (years < 10) return "senior";
      return "executive";
    }

    return "mid"; // default assumption
  }

  /**
   * Extract years of experience from text patterns
   */
  extractYearsOfExperience(text) {
    const yearsRegex = /(\d+)\+?\s*(?:years?|yrs?)/i;
    const matches = text.match(yearsRegex);

    if (matches) {
      const years = parseInt(matches[1]);
      return Math.min(years, 50); // Cap at 50 years max
    }

    return null;
  }

  /**
   * Detect industries based on keywords
   */
  detectIndustries(text) {
    const industries = {
      fintech: ["fintech", "finance", "banking", "crypto", "blockchain"],
      healthtech: ["healthcare", "medical", "hospital", "health", "pharma"],
      ecommerce: ["ecommerce", "retail", "shopping", "amazon", "shopify"],
      saas: ["saas", "software as a service", "cloud"],
      startup: ["startup", "venture", "seed", "growth stage"],
      enterprise: ["enterprise", "corporate", "microsoft", "google", "apple"],
      education: ["edutech", "education", "learning", "school", "university"],
      media: ["media", "social", "content", "youtube", "tiktok"],
    };

    const detected = [];
    for (const [industry, keywords] of Object.entries(industries)) {
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          detected.push(industry);
          break;
        }
      }
    }

    return detected.length > 0 ? detected : ["general"];
  }

  /**
   * Generate a smart resume summary
   */
  generateSummary(resumeText) {
    const parsed = this.parseResume(resumeText);
    const skillSummary = this.formatSkillsSummary(parsed.skills);
    const expLevel = parsed.experienceLevel;

    let summary = `${parsed.fullName} is a ${expLevel}-level developer with expertise in ${skillSummary}. `;

    if (parsed.yearsOfExperience) {
      summary += `${parsed.yearsOfExperience} years of professional experience. `;
    }

    if (parsed.industries.length > 0) {
      summary += `Background in ${parsed.industries.join(", ")}. `;
    }

    return summary;
  }

  /**
   * Format skills into readable summary
   */
  formatSkillsSummary(skills) {
    const topSkills = [];
    if (skills.frontend.length > 0)
      topSkills.push(...skills.frontend.slice(0, 2));
    if (skills.backend.length > 0)
      topSkills.push(...skills.backend.slice(0, 2));

    return topSkills.join(", ");
  }

  /**
   * Calculate what resume needs to match a job better
   */
  getRecommendationsForJob(resumeText, jobDescription) {
    const resumeSkills = this.parseResume(resumeText).skills;
    const jobSkills = this.extractJobSkills(jobDescription);

    const recommendations = {
      missingSkills: [],
      suggestedBulletPoints: [],
      skillGaps: [],
    };

    // Find missing skills
    for (const category of Object.keys(jobSkills)) {
      for (const skill of jobSkills[category]) {
        const found = resumeSkills[category]?.includes(skill);
        if (!found) {
          recommendations.missingSkills.push(skill);
        }
      }
    }

    // Suggest bullet points to add
    if (recommendations.missingSkills.length > 0) {
      recommendations.suggestedBulletPoints = this.generateBulletPoints(
        recommendations.missingSkills,
        jobDescription
      );
    }

    recommendations.skillGaps = recommendations.missingSkills.length;

    return recommendations;
  }

  /**
   * Extract required skills from job description
   */
  extractJobSkills(jobDescription) {
    return this.extractSkills(jobDescription.toLowerCase());
  }

  /**
   * AI-powered bullet point generator
   */
  generateBulletPoints(skills, jobDescription) {
    const templates = {
      React: "Developed responsive user interfaces using React and modern JavaScript",
      "Node.js": "Built scalable backend services using Node.js and Express",
      "Python":
        "Implemented data processing and API integrations using Python",
      "TypeScript":
        "Enforced type safety across large codebases using TypeScript",
      "Docker":
        "Containerized applications using Docker for consistent deployment",
      "AWS": "Deployed and managed applications on AWS cloud infrastructure",
      leadership:
        "Led cross-functional teams and mentored junior developers",
      agile: "Collaborated using Agile methodologies in sprint-based workflows",
    };

    return skills.slice(0, 3).map((skill) => {
      return (
        templates[skill] ||
        `Demonstrated expertise with ${skill} in professional projects`
      );
    });
  }

  /**
   * Get empty resume object
   */
  getEmptyResume() {
    return {
      fullName: null,
      email: null,
      phone: null,
      skills: {
        frontend: [],
        backend: [],
        database: [],
        devops: [],
        soft: [],
      },
      experienceLevel: null,
      yearsOfExperience: null,
      industries: [],
      rawText: "",
      summary: "",
    };
  }

  /**
   * Validate resume for completeness
   */
  validateResume(resumeData) {
    const issues = [];

    if (!resumeData.fullName) issues.push("Missing name");
    if (!resumeData.email) issues.push("Missing email");
    if (resumeData.skills.frontend.length === 0 && 
        resumeData.skills.backend.length === 0)
      issues.push("No technical skills detected");
    if (!resumeData.experienceLevel) issues.push("Experience level unclear");

    return {
      isValid: issues.length === 0,
      issues,
      completeness: ((5 - issues.length) / 5) * 100,
    };
  }
}

export default new ResumeParser();
