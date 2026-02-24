/**
 * Email Template Service
 * Generates beautiful HTML emails for job applications and notifications
 * Includes candidate summary, AI insights, and call-to-action
 */

class EmailTemplateService {
  /**
   * Generate email for job application submission
   * Sent to employer with candidate details
   */
  generateApplicationEmail(candidate, job, matchScore) {
    const trustScore = this.calculateTrustScoreForEmail(candidate);
    const matchPercentage = matchScore || 75;

    return {
      subject: `New Application: ${candidate.fullName} for ${job.jobTitle}`,
      to: job.contactEmail,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                background: #f8f9fa;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background: white;
              }
              .header {
                background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
                color: white;
                padding: 32px 24px;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 24px;
                font-weight: 600;
              }
              .content {
                padding: 32px 24px;
              }
              .candidate-card {
                background: #f0f4ff;
                border-left: 4px solid #1e40af;
                padding: 20px;
                margin: 20px 0;
                border-radius: 8px;
              }
              .score-badge {
                display: inline-block;
                background: #10b981;
                color: white;
                padding: 8px 16px;
                border-radius: 9999px;
                font-weight: 600;
                margin: 10px 0;
              }
              .score-badge.high {
                background: #10b981;
              }
              .score-badge.medium {
                background: #f59e0b;
              }
              .score-badge.low {
                background: #ef4444;
              }
              .ai-insights {
                background: #fffbeb;
                border-left: 4px solid #f59e0b;
                padding: 16px;
                margin: 20px 0;
                border-radius: 8px;
              }
              .ai-insights h3 {
                margin: 0 0 10px 0;
                color: #92400e;
                font-size: 14px;
                font-weight: 600;
              }
              .skills-list {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin: 12px 0;
              }
              .skill-tag {
                background: white;
                border: 1px solid #dbeafe;
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 12px;
                color: #1e40af;
              }
              .cta-button {
                display: inline-block;
                background: #1e40af;
                color: white;
                padding: 12px 28px;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 600;
                margin: 20px 0;
              }
              .footer {
                background: #f9fafb;
                padding: 24px;
                text-align: center;
                font-size: 12px;
                color: #6b7280;
                border-top: 1px solid #e5e7eb;
              }
              .divider {
                height: 1px;
                background: #e5e7eb;
                margin: 20px 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <!-- Header -->
              <div class="header">
                <h1>📬 New Application Received!</h1>
                <p style="margin: 8px 0 0 0; opacity: 0.9;">For: <strong>${job.jobTitle}</strong> at ${job.company}</p>
              </div>

              <!-- Main Content -->
              <div class="content">
                <!-- Candidate Summary -->
                <div class="candidate-card">
                  <h2 style="margin: 0 0 12px 0; color: #1f2937;">${candidate.fullName}</h2>
                  <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px;">${candidate.email}</p>
                  
                  <div style="margin: 16px 0;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                      <span style="font-weight: 600; color: #374151;">Match Score</span>
                      <span class="score-badge ${
                        matchPercentage >= 80
                          ? "high"
                          : matchPercentage >= 60
                          ? "medium"
                          : "low"
                      }">${matchPercentage}%</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <span style="font-weight: 600; color: #374151;">Trust Score</span>
                      <span class="score-badge high">${trustScore}/100 ⭐</span>
                    </div>
                  </div>
                </div>

                <!-- AI Insights -->
                <div class="ai-insights">
                  <h3>🤖 AI Insights</h3>
                  <p style="margin: 0; color: #92400e; font-size: 13px;">
                    ${this.generateAIInsight(candidate, job, matchPercentage)}
                  </p>
                </div>

                <!-- Candidate Skills -->
                <div>
                  <h3 style="margin: 20px 0 12px 0; color: #1f2937; font-size: 14px; font-weight: 600;">
                    ✓ Highlighted Skills
                  </h3>
                  <div class="skills-list">
                    ${candidate.skills
                      .slice(0, 6)
                      .map((skill) => `<span class="skill-tag">${skill}</span>`)
                      .join("")}
                  </div>
                </div>

                <div class="divider"></div>

                <!-- Experience -->
                <div>
                  <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">
                    📊 Experience
                  </h3>
                  <p style="margin: 0; color: #6b7280; font-size: 13px;">
                    ${candidate.yearsOfExperience || "N/A"} years of experience • 
                    ${candidate.experienceLevel || "N/A"} level
                  </p>
                </div>

                <!-- Call to Action -->
                <div style="text-align: center;">
                  <a href="${process.env.REACT_APP_API_URL || "https://aiblog.io"}/application/${candidate.id}" class="cta-button">
                    Review Full Application
                  </a>
                </div>
              </div>

              <!-- Footer -->
              <div class="footer">
                <p style="margin: 0 0 8px 0;">
                  <strong>Why this email?</strong> You're receiving this because ${candidate.fullName} applied to your job posting.
                </p>
                <p style="margin: 0;">
                  © 2026 AiBlog Job Portal. All rights reserved.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    };
  }

  /**
   * Generate confirmation email for candidate
   * Sent when candidate submits application
   */
  generateApplicationConfirmationEmail(candidate, job) {
    return {
      subject: `Application Confirmed: ${job.jobTitle} at ${job.company}`,
      to: candidate.email,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto; background: #f8f9fa; }
              .container { max-width: 600px; margin: 0 auto; background: white; }
              .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 32px 24px; text-align: center; }
              .content { padding: 32px 24px; }
              .success-box { background: #d1fae5; border-left: 4px solid #10b981; padding: 16px; margin: 20px 0; border-radius: 8px; }
              .success-box h3 { margin: 0 0 8px 0; color: #065f46; }
              .success-box p { margin: 0; color: #047857; font-size: 14px; }
              .next-steps { margin: 24px 0; }
              .step { display: flex; margin: 16px 0; }
              .step-num { background: #dbeafe; color: #1e40af; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; margin-right: 12px; flex-shrink: 0; }
              .step-text { color: #374151; font-size: 14px; }
              .footer { background: #f9fafb; padding: 24px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">✓ Application Submitted</h1>
                <p style="margin: 8px 0 0 0; opacity: 0.9;">Your application has been received</p>
              </div>
              <div class="content">
                <div class="success-box">
                  <h3>Great! You're in the running.</h3>
                  <p>
                    ${job.company} has received your application for the <strong>${job.jobTitle}</strong> position.
                    They'll review it shortly and reach out if they'd like to chat.
                  </p>
                </div>

                <h3 style="color: #1f2937; margin: 24px 0 16px 0;">What happens next?</h3>
                <div class="next-steps">
                  <div class="step">
                    <div class="step-num">1</div>
                    <div class="step-text">
                      <strong>Review Period</strong><br/>
                      The employer typically reviews applications within 3-7 days.
                    </div>
                  </div>
                  <div class="step">
                    <div class="step-num">2</div>
                    <div class="step-text">
                      <strong>Notifications</strong><br/>
                      We'll email you when the employer responds or views your application.
                    </div>
                  </div>
                  <div class="step">
                    <div class="step-num">3</div>
                    <div class="step-text">
                      <strong>Next Opportunity</strong><br/>
                      Keep exploring other roles while you wait.
                    </div>
                  </div>
                </div>

                <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; margin: 24px 0; border-radius: 8px;">
                  <p style="margin: 0; color: #1e40af; font-size: 13px;">
                    💡 <strong>Tip:</strong> Complete your profile with a portfolio link to stand out from other applicants.
                  </p>
                </div>
              </div>
              <div class="footer">
                <p style="margin: 0;">© 2026 AiBlog Job Portal</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };
  }

  /**
   * Generate novel job posting confirmation
   */
  generateJobPostingConfirmation(employer, job) {
    return {
      subject: `Your job "${job.jobTitle}" is now live!`,
      to: employer.contactEmail,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto; background: #f8f9fa; }
              .container { max-width: 600px; margin: 0 auto; background: white; }
              .header { background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; padding: 32px 24px; text-align: center; }
              .content { padding: 32px 24px; }
              .job-card { background: #f0f0ff; border: 1px solid #ddd6fe; padding: 16px; margin: 16px 0; border-radius: 8px; }
              .footer { background: #f9fafb; padding: 24px; text-align: center; font-size: 12px; color: #6b7280; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">🚀 Your Job is Live!</h1>
              </div>
              <div class="content">
                <p style="color: #374151; font-size: 16px; margin: 0 0 16px 0;">
                  Your job posting for <strong>${job.jobTitle}</strong> is now visible to thousands of qualified candidates.
                </p>

                <div class="job-card">
                  <h3 style="margin: 0 0 8px 0; color: #7c3aed;">${job.jobTitle}</h3>
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">
                    📍 ${job.location} • ${job.jobType} • ${job.salary}
                  </p>
                </div>

                <h3 style="color: #1f2937; margin: 24px 0 12px 0;">What to expect:</h3>
                <ul style="color: #6b7280; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>You'll receive emails when candidates apply</li>
                  <li>View candidate profiles and match scores in your dashboard</li>
                  <li>Message candidates directly through our platform</li>
                  <li>Manage your posting and view analytics</li>
                </ul>

                <div style="background: #dbeafe; color: #1e40af; padding: 16px; margin: 24px 0; border-radius: 8px; font-size: 13px;">
                  <strong>Pro Tip:</strong> Share your job on LinkedIn for 2x more visibility!
                </div>
              </div>
              <div class="footer">
                <p style="margin: 0;">© 2026 AiBlog Job Portal</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };
  }

  /**
   * Generate AI insight text based on candidate and job
   */
  generateAIInsight(candidate, job, matchPercentage) {
    const insights = [];

    if (matchPercentage >= 80) {
      insights.push(`${candidate.fullName} is a strong match for this role.`);
    } else if (matchPercentage >= 60) {
      insights.push(
        `${candidate.fullName} has relevant experience but may need some upskilling.`
      );
    } else {
      insights.push(
        `${candidate.fullName}'s background differs from the job requirements but could bring fresh perspectives.`
      );
    }

    if (candidate.experienceLevel === "senior") {
      insights.push("This candidate brings senior-level expertise.");
    } else if (candidate.experienceLevel === "mid") {
      insights.push("This is a mid-level contributor.");
    } else if (candidate.experienceLevel === "junior") {
      insights.push("This is an early-career talent with growth potential.");
    }

    if (candidate.bloggingContributions > 0) {
      insights.push(
        "They're an active contributor to our blogging community—expect strong communication skills."
      );
    }

    return insights.join(" ");
  }

  /**
   * Calculate trust score for display in email
   */
  calculateTrustScoreForEmail(candidate) {
    let score = 50;

    if (candidate.hasVerifiedEmail) score += 15;
    if (candidate.hasLinkedIn) score += 15;
    if (candidate.hasPortfolio) score += 10;
    if (candidate.bloggingContributions > 0) score += 10;

    return Math.min(score, 100);
  }
}

export default new EmailTemplateService();
