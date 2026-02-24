/**
 * Trust Score Calculator
 * Calculates company/employer trust scores based on:
 * - Posting history
 * - Hiring speed (time to fill positions)
 * - Application response rate
 * - Skill match accuracy
 * - Industry standing
 */

class TrustScoreCalculator {
  constructor() {
    this.weights = {
      postingHistory: 0.25, // 25% - Consistency of posting
      hiringSpeed: 0.2, // 20% - Average time to fill
      responseRate: 0.2, // 20% - Reply to applications
      skillAccuracy: 0.15, // 15% - Job requirement clarity
      industryStanding: 0.1, // 10% - Industry reputation
      verificationLevel: 0.1, // 10% - Identity/company verification
    };

    this.industryBenchmarks = {
      fintech: { hiringDays: 14, responseRate: 0.85 },
      healthtech: { hiringDays: 18, responseRate: 0.8 },
      ecommerce: { hiringDays: 10, responseRate: 0.9 },
      saas: { hiringDays: 16, responseRate: 0.85 },
      startup: { hiringDays: 7, responseRate: 0.95 },
      enterprise: { hiringDays: 21, responseRate: 0.75 },
      education: { hiringDays: 20, responseRate: 0.7 },
      default: { hiringDays: 15, responseRate: 0.8 },
    };
  }

  /**
   * Calculate overall employer trust score (0-100)
   * This would use real data from backend
   */
  calculateTrustScore(employer) {
    // In production, these would come from database/analytics
    const postingScore = this.assessPostingHistory(employer);
    const hiringScore = this.assessHiringSpeed(employer);
    const responseScore = this.assessResponseRate(employer);
    const skillScore = this.assessSkillAccuracy(employer);
    const industryScore = this.assessIndustryStanding(employer);
    const verificationScore = this.assessVerification(employer);

    const totalScore =
      postingScore * this.weights.postingHistory +
      hiringScore * this.weights.hiringSpeed +
      responseScore * this.weights.responseRate +
      skillScore * this.weights.skillAccuracy +
      industryScore * this.weights.industryStanding +
      verificationScore * this.weights.verificationLevel;

    return {
      overall: Math.round(totalScore),
      breakdown: {
        postingHistory: postingScore,
        hiringSpeed: hiringScore,
        responseRate: responseScore,
        skillAccuracy: skillScore,
        industryStanding: industryScore,
        verificationLevel: verificationScore,
      },
      badge: this.getTrustBadge(totalScore),
      recommendations: this.getRecommendations(
        {
          postingScore,
          hiringScore,
          responseScore,
          skillScore,
          industryScore,
          verificationScore,
        },
        employer
      ),
    };
  }

  /**
   * Assess posting history consistency
   * Employers who post regularly (not one-off) are more trustworthy
   */
  assessPostingHistory(employer) {
    const jobsPosted = employer.totalJobsPosted || 0;
    const weeksActive = employer.weeksActive || 1;
    const postsPerWeek = jobsPosted / Math.max(weeksActive, 1);

    if (postsPerWeek >= 2) return 100; // Very active
    if (postsPerWeek >= 1) return 85;
    if (postsPerWeek >= 0.5) return 70;
    if (jobsPosted >= 5) return 60;
    if (jobsPosted >= 1) return 40;
    return 20; // First-time poster
  }

  /**
   * Assess hiring speed
   * Faster hiring = clearer requirements = more trustworthy
   */
  assessHiringSpeed(employer) {
    const avgHiringDays = employer.avgDaysToHire || 15;
    const industry = employer.industry || "default";
    const benchmark = this.industryBenchmarks[industry];

    const deviation = Math.abs(avgHiringDays - benchmark.hiringDays);
    const score = Math.max(0, 100 - deviation * 2);

    return score;
  }

  /**
   * Assess response rate to applications
   * Higher response = more engaged = trustworthy
   */
  assessResponseRate(employer) {
    const responseRate = (employer.responseRate || 0.5) * 100; // Convert to 0-100
    return Math.min(responseRate, 100);
  }

  /**
   * Assess skill requirement clarity
   * Clear, well-written requirements = better hiring practices
   */
  assessSkillAccuracy(employer) {
    const avgJobDescLength = employer.avgJobDescriptionLength || 500;
    const skillMentionClarity = employer.skillMentionClarity || 0.5;

    let score = 0;

    // Good descriptions are 300-2000 words
    if (avgJobDescLength >= 300 && avgJobDescLength <= 2000) {
      score += 50;
    } else if (avgJobDescLength >= 150) {
      score += 30;
    }

    // Clarity of skill mentions (0-1)
    score += skillMentionClarity * 50;

    return Math.min(score, 100);
  }

  /**
   * Assess industry standing and company reputation
   */
  assessIndustryStanding(employer) {
    let score = 50; // Base score

    // Company size reputation
    if (employer.isFortuneCompany) score += 30;
    if (employer.hasPublicTicker) score += 20;
    if (employer.yearsInBusiness > 10) score += 15;
    if (employer.yearsInBusiness > 5) score += 10;

    // Industry prominence
    if (employer.isIndustryLeader) score += 10;

    // Customer satisfaction (if available)
    if (employer.glassdoorRating) {
      score += (employer.glassdoorRating / 5) * 10;
    }

    return Math.min(score, 100);
  }

  /**
   * Assess verification level
   * Verified email, verified company info, etc.
   */
  assessVerification(employer) {
    let score = 0;

    if (employer.emailVerified) score += 30;
    if (employer.companyDomainVerified) score += 25;
    if (employer.linkedInVerified) score += 20;
    if (employer.manualVerification) score += 25;

    return Math.min(score, 100);
  }

  /**
   * Get trust badge (icon + color)
   */
  getTrustBadge(score) {
    if (score >= 85)
      return {
        level: "platinum",
        color: "from-blue-400 to-cyan-400",
        label: "Verified Elite Employer",
        icon: "⭐⭐⭐",
      };
    if (score >= 70)
      return {
        level: "gold",
        color: "from-yellow-400 to-amber-400",
        label: "Verified Employer",
        icon: "⭐⭐",
      };
    if (score >= 50)
      return {
        level: "silver",
        color: "from-gray-300 to-gray-400",
        label: "Active Employer",
        icon: "⭐",
      };
    return {
      level: "bronze",
      color: "from-orange-300 to-orange-400",
      label: "New Employer",
      icon: "✓",
    };
  }

  /**
   * Generate recommendations to improve trust score
   */
  getRecommendations(breakdown, employer) {
    const recommendations = [];

    if (breakdown.postingScore < 70) {
      recommendations.push(
        "Post more regularly to build employer credibility"
      );
    }

    if (breakdown.responseScore < 70) {
      recommendations.push("Respond faster to applications to increase trust");
    }

    if (breakdown.skillScore < 70) {
      recommendations.push("Write more detailed job descriptions");
    }

    if (breakdown.verificationScore < 70) {
      recommendations.push(
        "Complete company verification (email, domain, LinkedIn)"
      );
    }

    if (breakdown.hiringScore < 70) {
      recommendations.push(
        "Improve hiring process efficiency to match industry standards"
      );
    }

    return recommendations;
  }

  /**
   * Compare candidate profile to job requirements
   * Returns trust score for job fit
   */
  calculateCandidateTrustScore(candidate, job) {
    let score = 50; // Base trust score

    // Experience level match
    const levelMatch = this.experienceLevelMatch(
      candidate.experienceLevel,
      job.seniorityLevel
    );
    score += levelMatch * 20;

    // Skill overlap
    const skillOverlap = this.calculateSkillOverlap(
      candidate.skills,
      job.requiredSkills
    );
    score += skillOverlap * 30;

    // Industry experience
    if (candidate.industries.includes(job.industry)) {
      score += 15;
    }

    // Blogging activity (if available)
    if (candidate.bloggingContributions > 0) {
      score += 10;
    }

    // Profile completeness
    const completeness =
      (candidate.hasVerifiedEmail ? 1 : 0) +
      (candidate.hasLinkedIn ? 1 : 0) +
      (candidate.hasPortfolio ? 1 : 0);
    score += completeness * 5;

    return Math.min(score, 100);
  }

  /**
   * Check experience level match
   */
  experienceLevelMatch(candidateLevel, requiredLevel) {
    const levels = ["junior", "mid", "senior", "executive"];
    const candidateIdx = levels.indexOf(candidateLevel);
    const requiredIdx = levels.indexOf(requiredLevel);

    const diff = Math.abs(candidateIdx - requiredIdx);

    if (diff === 0) return 1.0; // Perfect match
    if (diff === 1) return 0.8; // Close match
    if (diff === 2) return 0.5; // Somewhat related
    return 0.2; // Very different
  }

  /**
   * Calculate skill overlap percentage
   */
  calculateSkillOverlap(candidateSkills, requiredSkills) {
    if (requiredSkills.length === 0) return 1.0;

    let matched = 0;

    for (const skill of requiredSkills) {
      if (this.skillMatches(skill, candidateSkills)) {
        matched++;
      }
    }

    return matched / requiredSkills.length;
  }

  /**
   * Check if candidate has skill (fuzzy match)
   */
  skillMatches(requiredSkill, candidateSkills) {
    const required = requiredSkill.toLowerCase();

    // Direct match
    for (const skill of candidateSkills) {
      if (skill.toLowerCase() === required) return true;
    }

    // Fuzzy match for related skills
    const synonyms = {
      react: ["vue", "angular", "svelte"],
      python: ["django", "flask", "fastapi"],
      nodejs: ["express", "nest.js"],
      aws: ["azure", "gcp", "cloud"],
    };

    if (synonyms[required]) {
      return candidateSkills.some((skill) =>
        synonyms[required].includes(skill.toLowerCase())
      );
    }

    return false;
  }

  /**
   * Get featured employers by trust score
   */
  getFeaturedEmployers(employers, limit = 5) {
    return employers
      .map((emp) => ({
        ...emp,
        trustScore: this.calculateTrustScore(emp).overall,
      }))
      .sort((a, b) => b.trustScore - a.trustScore)
      .slice(0, limit);
  }
}

export default new TrustScoreCalculator();
