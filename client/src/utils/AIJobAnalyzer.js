/**
 * AI Job Analyzer Service
 * Provides AI-powered job analysis and matching insights
 */

export const AIJobAnalyzer = {
  /**
   * Analyze job match and provide insights
   * @param {Object} job - Job object
   * @param {Object} userProfile - User's skills and experience
   * @returns {Object} AI insights
   */
  async analyzeJobMatch(job, userProfile = {}) {
    try {
      // For now, use intelligent scoring logic
      // In production, this would call an AI service
      
      const skills = userProfile.skills || [];
      const experience = userProfile.experience || [];
      const salary = userProfile.expectedSalary || 0;

      // Calculate skill match
      const jobSkillsRequired = this.extractSkills(job);
      const matchedSkills = jobSkillsRequired.filter((s) =>
        skills.some((us) => us.toLowerCase().includes(s.toLowerCase()))
      );
      const skillMatchPercent = jobSkillsRequired.length
        ? Math.round((matchedSkills.length / jobSkillsRequired.length) * 100)
        : 50;

      // Calculate experience match
      const experienceMatch = this.calculateExperienceMatch(
        job,
        experience
      );

      // Generate insights
      const insights = {
        whyGoodMatch: this.generateMatchReason(job, skills, matchedSkills),
        skillsToLearn: this.getSkillsToLearn(jobSkillsRequired, skills),
        careerpPath: this.suggestCareerPath(job, experience),
        salaryInsight: this.analyzeSalary(job, salary),
        recommendationScore: Math.round(
          (skillMatchPercent + experienceMatch + 70) / 3
        ),
      };

      return insights;
    } catch (error) {
      console.error("Error analyzing job:", error);
      return this.getDefaultInsights();
    }
  },

  /**
   * Extract required skills from job description
   */
  extractSkills(job) {
    const commonSkills = [
      "JavaScript",
      "React",
      "Python",
      "Java",
      "Node.js",
      "SQL",
      "AWS",
      "Docker",
      "Git",
      "REST API",
      "GraphQL",
      "HTML",
      "CSS",
      "TypeScript",
      "MongoDB",
      "PostgreSQL",
      "Vue.js",
      "Angular",
      "DevOps",
      "CI/CD",
    ];

    const description = `${job.title} ${job.description || ""} ${job.requirements || ""}`.toUpperCase();
    return commonSkills.filter((skill) =>
      description.includes(skill.toUpperCase())
    );
  },

  /**
   * Calculate experience match score
   */
  calculateExperienceMatch(job, userExperience) {
    // Base score
    let score = 50;

    // Add points for seniority match
    const jobSeniority = job.level || "mid";
    const userLevel = userExperience.level || "entry";
    
    if (jobSeniority === userLevel) score += 30;
    else if (
      (jobSeniority === "entry" && userLevel === "mid") ||
      (jobSeniority === "mid" && userLevel === "senior")
    ) {
      score += 20;
    }

    return Math.min(score, 100);
  },

  /**
   * Generate why this is a good match
   */
  generateMatchReason(job, skills, matchedSkills) {
    const reasons = [];

    if (matchedSkills.length > 0) {
      reasons.push(
        `Your ${matchedSkills.slice(0, 2).join(" and ")} skills are directly applicable`
      );
    }

    if (job.industry) {
      reasons.push(`Growth opportunity in ${job.industry} sector`);
    }

    if (job.company) {
      reasons.push(`${job.company} is known for great career development`);
    }

    return reasons[0] || "Strong overall match for your profile";
  },

  /**
   * Suggest skills to learn
   */
  getSkillsToLearn(requiredSkills, userSkills) {
    return requiredSkills
      .filter(
        (s) =>
          !userSkills.some((us) =>
            us.toLowerCase().includes(s.toLowerCase())
          )
      )
      .slice(0, 3);
  },

  /**
   * Suggest career path
   */
  suggestCareerPath(job, experience) {
    const jobData = job.title.toLowerCase();
    
    if (jobData.includes("junior")) {
      return "Start here to build fundamentals";
    } else if (jobData.includes("senior") || jobData.includes("lead")) {
      return "Perfect for taking on leadership responsibilities";
    } else if (jobData.includes("manager")) {
      return "Great opportunity for management track";
    } else {
      return "Lateral move to expand your expertise";
    }
  },

  /**
   * Analyze salary compared to user expectation
   */
   analyzeSalary(job, expectedSalary) {
    const jobSalary = job.salaryMax || job.salary || 0;
    if (!expectedSalary || expectedSalary === 0) return "Competitive salary";

    const difference = jobSalary - expectedSalary;
    const percentDiff = Math.round((difference / expectedSalary) * 100);

    if (percentDiff > 20) return "Above your expectations 📈";
    if (percentDiff > 0) return "Slightly above expectations";
    if (percentDiff > -10) return "Close to your range";
    return "Below expectations";
  },

  /**
   * Get default insights when analysis fails
   */
  getDefaultInsights() {
    return {
      whyGoodMatch: "Matches your experience level",
      skillsToLearn: ["Advanced certifications", "Domain expertise"],
      careerPath: "Strong career progression opportunity",
      salaryInsight: "Competitive compensation package",
      recommendationScore: 75,
    };
  },
};
