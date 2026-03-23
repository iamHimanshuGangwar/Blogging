/**
 * Enhanced Resume Parser
 * Extracts skills, experience, education from resume content
 */

const TECH_STACK = {
  frontend: [
    "react", "vue", "angular", "next.js", "svelte", "ember",
    "html", "css", "javascript", "typescript", "sass", "less",
    "tailwind", "bootstrap", "material", "webpack", "vite"
  ],
  backend: [
    "node.js", "express", "django", "flask", "java", "spring",
    "python", "php", "ruby", "rails", "asp.net", "dotnet",
    "golang", "rust", "fastapi", "nestjs"
  ],
  database: [
    "mongodb", "mysql", "postgres", "postgresql", "sql",
    "redis", "cassandra", "elasticsearch", "firebase", "dynamodb",
    "oracle", "mariadb", "sqlite"
  ],
  devops: [
    "docker", "kubernetes", "aws", "gcp", "azure", "jenkins",
    "gitlab", "github", "ci/cd", "terraform", "ansible",
    "prometheus", "grafana", "nginx", "apache"
  ],
  tools: [
    "git", "linux", "github", "gitlab", "jira", "agile",
    "scrum", "trello", "confluence", "slack", "figma"
  ]
};

export const ResumeParser = {
  /**
   * Extract skills from resume text
   */
  extractSkills(resumeText) {
    if (!resumeText) return { matched: [], notMatched: [] };

    const text = resumeText.toLowerCase();
    const matched = [];
    const notMatched = [];

    // Search through all categories
    Object.entries(TECH_STACK).forEach(([category, skills]) => {
      skills.forEach(skill => {
        // Use word boundary to avoid partial matches
        const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
        if (regex.test(text)) {
          matched.push({ skill, category, confidence: 1.0 });
        }
      });
    });

    return { matched, allSkills: Object.values(TECH_STACK).flat() };
  },

  /**
   * Extract years of experience
   */
  extractExperience(resumeText) {
    if (!resumeText) return 0;

    const text = resumeText.toLowerCase();
    
    // Match patterns like "5 years", "3+ years", "10+ years of experience"
    const patterns = [
      /(\d+)\+?\s*years?\s*(?:of\s*)?experience/gi,
      /experience[:\s]+(\d+)\+?\s*years/gi,
      /(\d+)\s*years?\s*(?:as|at|with)/gi
    ];

    let maxYears = 0;

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const years = parseInt(match[1]);
        maxYears = Math.max(maxYears, years);
      }
    });

    return maxYears;
  },

  /**
   * Extract education level
   */
  extractEducation(resumeText) {
    if (!resumeText) return "not-specified";

    const text = resumeText.toLowerCase();

    if (text.includes("phd") || text.includes("doctorate")) return "phd";
    if (text.includes("master")) return "master";
    if (text.includes("bachelor") || text.includes("b.tech") || text.includes("b.s.")) return "bachelor";
    if (text.includes("diploma") || text.includes("associate")) return "associate";
    if (text.includes("high school") || text.includes("12th")) return "highschool";

    return "not-specified";
  },

  /**
   * Extract certifications
   */
  extractCertifications(resumeText) {
    if (!resumeText) return [];

    const text = resumeText.toLowerCase();
    const certifications = [];

    const certPatterns = [
      { name: "AWS Certified", keywords: ["aws", "certified", "amazon"] },
      { name: "Google Cloud Certified", keywords: ["gcp", "google cloud", "certified"] },
      { name: "Kubernetes", keywords: ["ckad", "cka", "kubernetes"] },
      { name: "Docker", keywords: ["docker", "certified"] },
      { name: "Azure Certified", keywords: ["azure", "microsoft", "certified"] },
      { name: "Scrum Master", keywords: ["scrum", "master", "csm"] },
      { name: "Product Manager", keywords: ["product", "manager", "certified", "pm"] },
    ];

    certPatterns.forEach(cert => {
      if (cert.keywords.some(kw => text.includes(kw))) {
        certifications.push(cert.name);
      }
    });

    return certifications;
  },

  /**
   * Parse complete resume profile
   */
  parseResume(resumeText) {
    const skills = this.extractSkills(resumeText);
    const experience = this.extractExperience(resumeText);
    const education = this.extractEducation(resumeText);
    const certifications = this.extractCertifications(resumeText);

    return {
      skills,
      experience,
      education,
      certifications,
      timestamp: new Date().toISOString()
    };
  },

  /**
   * Calculate match score between resume and job
   */
  calculateMatchScore(resumeProfile, jobDescription) {
    if (!resumeProfile || !jobDescription) return 0;

    let score = 0;
    const weights = {
      skills: 0.6,
      experience: 0.25,
      education: 0.15
    };

    // Extract job requirements
    const jobText = `${jobDescription.title} ${jobDescription.description}`.toLowerCase();
    const jobSkills = this.extractSkills(jobText).matched;

    // Skills matching
    const matchedSkills = resumeProfile.skills.matched.filter(skill =>
      jobSkills.some(js => js.skill === skill.skill)
    );
    const skillsScore = jobSkills.length > 0
      ? (matchedSkills.length / jobSkills.length) * 100
      : 100;

    // Experience matching
    const jobExp = this.extractExperience(jobDescription.description) || 0;
    const experienceScore = resumeProfile.experience >= jobExp ? 100 : (resumeProfile.experience / Math.max(jobExp, 1)) * 100;

    // Education matching
    const educationLevels = ["not-specified", "highschool", "associate", "bachelor", "master", "phd"];
    const jobEduReq = educationLevels.indexOf(this.extractEducation(jobDescription.description));
    const userEduLevel = educationLevels.indexOf(resumeProfile.education);
    const educationScore = userEduLevel >= jobEduReq ? 100 : (userEduLevel / Math.max(jobEduReq, 1)) * 100;

    // Calculate weighted score
    score = (skillsScore * weights.skills +
      experienceScore * weights.experience +
      educationScore * weights.education) / 1;

    return Math.min(100, Math.max(0, Math.round(score)));
  }
};

export default ResumeParser;
