/**
 * Gemini AI Service for Resume Tailoring
 * Uses Google's Generative AI API to provide intelligent resume suggestions
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export const GeminiAIService = {
  /**
   * Tailor resume content for a specific job using Gemini AI
   * @param {Object} job - Job object with title, description, requirements
   * @param {Object} userResume - User's resume data
   * @returns {Promise<Object>} AI-tailored resume suggestions
   */
  async tailorResumeForJob(job, userResume = {}) {
    try {
      if (!GEMINI_API_KEY) {
        console.warn("Gemini API key not configured");
        return this.getLocalSuggestions(job, userResume);
      }

      const prompt = this.buildTailoringPrompt(job, userResume);

      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (!response.ok) {
        console.error("Gemini API error:", response.statusText);
        return this.getLocalSuggestions(job, userResume);
      }

      const data = await response.json();

      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        const aiResponse = data.candidates[0].content.parts[0].text;
        return this.parseAIResponse(aiResponse, job);
      }

      return this.getLocalSuggestions(job, userResume);
    } catch (error) {
      console.error("Gemini AI Service Error:", error);
      return this.getLocalSuggestions(job, userResume);
    }
  },

  /**
   * Build prompt for resume tailoring
   */
  buildTailoringPrompt(job, userResume) {
    const jobTitle = job.title || "Software Developer";
    const jobDescription = job.description || "";
    const jobRequirements = job.requirements || "";

    const userSkills = userResume.skills?.join(", ") || "";
    const userExperience = userResume.experience?.map(exp => `${exp.title} at ${exp.company}`).join(", ") || "";

    return `
You are an expert resume writer and career coach. Help tailor a resume for this job opportunity.

JOB DETAILS:
Title: ${jobTitle}
Description: ${jobDescription}
Requirements: ${jobRequirements}

USER RESUME:
Skills: ${userSkills}
Experience: ${userExperience}

Please provide concise, actionable suggestions to tailor the resume for this position. Format your response as JSON with the following structure:
{
  "summary": "A 2-3 sentence professional summary tailored to this role",
  "keySkillsToHighlight": ["skill1", "skill2", "skill3"],
  "bulletPoints": [
    "Achievement statement aligned with this role",
    "Another relevant accomplishment",
    "Third relevant achievement"
  ],
  "skillGaps": ["skill1", "skill2"],
  "matchScore": 85,
  "recommendations": [
    "Specific recommendation 1",
    "Specific recommendation 2"
  ]
}

Provide ONLY the JSON response, no other text.
`;
  },

  /**
   * Parse Gemini AI response
   */
  parseAIResponse(response, job) {
    try {
      // Normalize to JSON-like string
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const raw = jsonMatch ? jsonMatch[0] : response;
      const cleaned = raw
        .trim()
        .replace(/\n\s*\d+\./g, ",") // strip numbered list prefixes for broken JSON outputs
        .replace(/\"/g, '"');

      // Try direct JSON parse
      const parsed = JSON.parse(cleaned);

      return {
        success: true,
        jobTitle: job.title,
        summary: parsed.summary || "",
        keySkillsToHighlight: parsed.keySkillsToHighlight || parsed.keySkillsToAdd || [],
        bulletPoints: parsed.bulletPoints || [],
        skillGaps: parsed.skillGaps || [],
        matchScore: parsed.matchScore || parsed.matchPercentage || 75,
        recommendations: parsed.recommendations || [],
        source: "gemini",
      };
    } catch (error) {
      console.error("Error parsing Gemini response:", error);
      return this.getLocalSuggestions(job, {});
    }
  },

  /**
   * Local suggestions fallback when Gemini is not available
   */
  getLocalSuggestions(job, userResume) {
    return {
      success: true,
      jobTitle: job.title,
      summary: `Experienced professional seeking ${job.title} position to leverage technical skills and contribute to team success.`,
      keySkillsToHighlight: this.extractKeySkills(job),
      bulletPoints: [
        `Contributed to projects requiring expertise in ${this.getMainSkill(job)}`,
        `Demonstrated strong problem-solving abilities in ${job.industry || "technology"} domain`,
        `Collaborated effectively with cross-functional teams to deliver quality results`,
      ],
      skillGaps: [
        "Advanced proficiency in emerging technologies",
        "Industry-specific certifications",
      ],
      matchScore: 70,
      recommendations: [
        `Add quantifiable achievements demonstrating ${this.getMainSkill(job)} expertise`,
        "Include specific metrics and business impact of your work",
        "Highlight relevant certifications and continuous learning",
      ],
      source: "local",
    };
  },

  /**
   * Extract key skills from job
   */
  extractKeySkills(job) {
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
      "HTML/CSS",
      "TypeScript",
      "MongoDB",
      "PostgreSQL",
      "Leadership",
      "Communication",
      "Problem Solving",
    ];

    const description = `${job.title} ${job.description || ""} ${
      job.requirements || ""
    }`.toUpperCase();

    return commonSkills.filter(
      (skill) =>
        description.includes(skill.toUpperCase()) ||
        (job.industry && skill.toLowerCase().includes(job.industry.toLowerCase()))
    );
  },

  /**
   * Get main skill from job
   */
  getMainSkill(job) {
    const skills = this.extractKeySkills(job);
    return skills[0] || "technical";
  },

  /**
   * Generate cover letter suggestions using Gemini
   */
  async generateCoverLetter(job, userResume = {}) {
    try {
      if (!GEMINI_API_KEY) {
        return this.getLocalCoverLetter(job);
      }

      const prompt = `
Write a professional cover letter for this job position. Keep it concise (3-4 paragraphs).

Job Title: ${job.title}
Company: ${job.company}
Job Description: ${job.description}

Candidate Skills: ${userResume.skills?.join(", ") || "Not provided"}
Candidate Experience: ${userResume.experience?.map(e => e.title).join(", ") || "Not provided"}

Please write a compelling cover letter that highlights the candidate's fit for this role.
`;

      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 800,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.candidates?.[0]?.content?.parts[0]?.text) {
          return {
            success: true,
            content: data.candidates[0].content.parts[0].text,
            source: "gemini",
          };
        }
      }

      return this.getLocalCoverLetter(job);
    } catch (error) {
      console.error("Error generating cover letter:", error);
      return this.getLocalCoverLetter(job);
    }
  },

  /**
   * Local cover letter fallback
   */
  getLocalCoverLetter(job) {
    return {
      success: true,
      content: `Dear Hiring Manager,

I am writing to express my strong interest in the ${job.title} position at ${job.company}. With my background in ${job.industry || "technology"} and proven track record of success, I am confident I can contribute significantly to your team.

In my previous roles, I have developed strong expertise in key areas relevant to this position. My ability to quickly learn new technologies and adapt to changing business needs positions me well to excel in this role and support your team's objectives.

I am excited about the opportunity to bring my skills and experience to ${job.company}. I would welcome the chance to discuss how my background aligns with your team's needs.

Thank you for considering my application.

Best regards`,
      source: "local",
    };
  },
};
