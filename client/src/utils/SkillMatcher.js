/**
 * Advanced Skill Matching Algorithm
 * Analyzes resume skills vs job requirements to provide accurate match scores
 */

class SkillMatcher {
  constructor() {
    // Skill categories and their synonyms
    this.skillCategories = {
      frontend: {
        skills: ["react", "vue", "angular", "typescript", "javascript", "html", "css", "sass", "webpack"],
        weight: 1.2,
      },
      backend: {
        skills: ["node.js", "nodejs", "python", "java", "golang", "rust", "ruby", ".net", "django", "flask"],
        weight: 1.2,
      },
      database: {
        skills: ["mongodb", "postgresql", "mysql", "redis", "firebase", "dynamodb", "elasticsearch"],
        weight: 1.1,
      },
      devops: {
        skills: ["docker", "kubernetes", "aws", "azure", "gcp", "ci/cd", "jenkins", "github actions"],
        weight: 0.9,
      },
      soft: {
        skills: ["communication", "teamwork", "leadership", "problem solving", "time management"],
        weight: 0.8,
      },
    };

    // Skill importance levels
    this.importanceLevels = {
      critical: 1.5, // Must have
      important: 1.2, // Strongly preferred
      nice: 0.8, // Nice to have
      bonus: 0.5, // Bonus points
    };
  }

  /**
   * Parse resume text and extract skills
   */
  extractSkillsFromResume(resumeText) {
    if (!resumeText) return [];

    const skills = [];
    const normalizedText = resumeText.toLowerCase();

    // Search through all skill categories
    for (const category of Object.values(this.skillCategories)) {
      for (const skill of category.skills) {
        if (normalizedText.includes(skill)) {
          skills.push(skill);
        }
      }
    }

    // Remove duplicates
    return [...new Set(skills)];
  }

  /**
   * Extract requirements from job description
   */
  extractRequirementsFromJob(jobDescription) {
    if (!jobDescription) return [];

    const requirements = [];
    const normalizedText = jobDescription.toLowerCase();

    // Look for requirement indicators
    const requirementPatterns = [
      /(?:required|must have|skills?)[:\s]+([^.!?]*)/gi,
      /(?:proficiency in|experience with)[:\s]+([^.!?]*)/gi,
    ];

    for (const pattern of requirementPatterns) {
      let match;
      while ((match = pattern.exec(jobDescription)) !== null) {
        const text = match[1].toLowerCase();
        for (const category of Object.values(this.skillCategories)) {
          for (const skill of category.skills) {
            if (text.includes(skill) && !requirements.includes(skill)) {
              requirements.push(skill);
            }
          }
        }
      }
    }

    // If no patterns matched, extract individual skill mentions
    if (requirements.length === 0) {
      for (const category of Object.values(this.skillCategories)) {
        for (const skill of category.skills) {
          if (normalizedText.includes(skill)) {
            requirements.push(skill);
          }
        }
      }
    }

    return [...new Set(requirements)];
  }

  /**
   * Calculate match score between resume and job
   * Returns score 0-100 with detailed breakdown
   */
  calculateMatchScore(resumeText, jobDescription, jobTitle) {
    const resumeSkills = this.extractSkillsFromResume(resumeText);
    const jobRequirements = this.extractRequirementsFromJob(jobDescription);

    if (jobRequirements.length === 0) {
      return {
        score: 50, // Default if no requirements found
        matchedSkills: [],
        missingSkills: [],
        bonus: 0,
        breakdown: "Unable to parse job requirements",
      };
    }

    let totalWeight = 0;
    let matchedWeight = 0;
    const matchedSkills = [];
    const missingSkills = [];

    // Calculate weights for each requirement
    for (const requirement of jobRequirements) {
      const requirement_weight = this.getSkillWeight(requirement);
      totalWeight += requirement_weight;

      if (resumeSkills.includes(requirement)) {
        matchedWeight += requirement_weight;
        matchedSkills.push(requirement);
      } else {
        missingSkills.push(requirement);
      }
    }

    // Base score from skill match
    let baseScore = totalWeight > 0 ? (matchedWeight / totalWeight) * 100 : 50;

    // Bonus points for overqualification (having more skills than required)
    const extraSkills = resumeSkills.filter(
      (skill) => !jobRequirements.includes(skill)
    );
    const bonusScore = Math.min(extraSkills.length * 2, 10);

    // Add title relevance boost
    const titleBoost = this.getTitleBoost(jobTitle, resumeText);

    const finalScore = Math.min(100, Math.round(baseScore + bonusScore + titleBoost));

    return {
      score: finalScore,
      baseScore: Math.round(baseScore),
      matchedSkills,
      missingSkills,
      extraSkills: extraSkills.slice(0, 5),
      bonus: bonusScore,
      titleBoost,
      skillGap: missingSkills.length,
      percentageMatch: Math.round((matchedSkills.length / jobRequirements.length) * 100),
    };
  }

  /**
   * Get weight for a skill based on category
   */
  getSkillWeight(skill) {
    const normalizedSkill = skill.toLowerCase();

    for (const category of Object.values(this.skillCategories)) {
      if (category.skills.some((s) => normalizedSkill.includes(s))) {
        return category.weight;
      }
    }

    return 1.0; // Default weight
  }

  /**
   * Add boost if job title matches resume experience
   */
  getTitleBoost(jobTitle, resumeText) {
    const normalizedJobTitle = jobTitle.toLowerCase();
    const normalizedResume = resumeText.toLowerCase();

    const titleKeywords = normalizedJobTitle.split(/[^a-z0-9]+/);

    let matches = 0;
    for (const keyword of titleKeywords) {
      if (keyword.length > 3 && normalizedResume.includes(keyword)) {
        matches++;
      }
    }

    return Math.min(matches * 3, 15);
  }

  /**
   * Get personalized recommendations
   */
  getRecommendations(matchData, jobTitle) {
    const recommendations = [];

    if (matchData.skillGap > 0) {
      const topMissing = matchData.missingSkills.slice(0, 2);
      recommendations.push({
        type: "learn",
        message: `Consider learning ${topMissing.join(" and ")} to strengthen your application`,
        priority: "high",
      });
    }

    if (matchData.matchedSkills.length > 0) {
      recommendations.push({
        type: "highlight",
        message: `Highlight your ${matchData.matchedSkills.slice(0, 2).join(" and ")} experience in your cover letter`,
        priority: "high",
      });
    }

    if (matchData.extraSkills.length > 2) {
      recommendations.push({
        type: "bonus",
        message: `Your additional experience with ${matchData.extraSkills.slice(0, 2).join(" and ")} is a great bonus`,
        priority: "medium",
      });
    }

    if (matchData.score >= 75) {
      recommendations.push({
        type: "confidence",
        message: "You're a great fit for this role. Apply with confidence!",
        priority: "high",
        emoji: "🎯",
      });
    } else if (matchData.score >= 50) {
      recommendations.push({
        type: "info",
        message: "You have relevant skills. Don't hesitate to apply!",
        priority: "medium",
      });
    }

    return recommendations;
  }
}

export default SkillMatcher;
