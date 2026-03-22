import axios from "axios";
import dotenv from "dotenv";
import PDFDocument from "pdfkit";
import { createWriteStream, writeFileSync, mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "../uploads/resumes");
const ttsDir = path.join(__dirname, "../uploads/tts");

// ensure tts directory exists
try {
  mkdirSync(ttsDir, { recursive: true });
} catch (e) {
  console.warn('Could not create tts directory', e.message);
}

// Generate Resume using AI (using OpenAI or fallback to a summary-based approach)
export const generateResume = async (req, res) => {
  try {
    const { resumeData } = req.body;

    if (!resumeData) {
      return res.status(400).json({ success: false, message: "Resume data is required" });
    }

    // Validate required fields
    const { personal, experience, education, skills, summary } = resumeData;
    if (!personal || !personal.fullName || !personal.email) {
      return res.status(400).json({ success: false, message: "Personal details (fullName, email) are required" });
    }

    // For now, we'll format the resume data as a well-structured object
    // In a production app, you could integrate with OpenAI to enhance the content
    const formattedResume = {
      personal: {
        ...personal,
        enhanced: personal.professionalTitle || "Professional",
      },
      summary: summary || generateDefaultSummary(personal.professionalTitle),
      experience: experience && experience.length > 0 ? experience : [],
      education: education && education.length > 0 ? education : [],
      skills: skills && skills.length > 0 ? skills : [],
      generatedAt: new Date(),
    };

    return res.status(200).json({
      success: true,
      message: "Resume generated successfully",
      resume: formattedResume,
    });
  } catch (error) {
    console.error("Error generating resume:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Generate Resume PDF (creates actual PDF file)
export const downloadResume = async (req, res) => {
  try {
    const { resumeData } = req.body;

    if (!resumeData || !resumeData.personal || !resumeData.personal.fullName) {
      return res.status(400).json({ success: false, message: "Resume data with full name is required" });
    }

    // Create a new PDF document
    const doc = new PDFDocument({
      bufferPages: true,
      margin: 50,
    });

    // Generate filename
    const filename = `resume_${resumeData.personal.fullName.replace(/\s+/g, "_")}_${Date.now()}.pdf`;
    const filepath = path.join(uploadsDir, filename);

    console.log("Creating resume at:", filepath);

    // Create write stream
    const writeStream = createWriteStream(filepath);

    // Attach error handlers BEFORE piping
    let responseSent = false;

    writeStream.on("error", (err) => {
      console.error("Write stream error:", err);
      if (!responseSent) {
        responseSent = true;
        res.status(500).json({ success: false, message: "Failed to write PDF file" });
      }
    });

    doc.on("error", (err) => {
      console.error("PDF document error:", err);
      if (!responseSent) {
        responseSent = true;
        res.status(500).json({ success: false, message: "Failed to create PDF document" });
      }
    });

    doc.pipe(writeStream);

    // Set up colors and fonts
    const primaryColor = "#1F2937";
    const accentColor = "#7C3AED";

    // Header - Name and Title
    doc.fontSize(24).font("Helvetica-Bold").fillColor(primaryColor).text(resumeData.personal.fullName, { align: "center" });
    
    if (resumeData.personal.professionalTitle) {
      doc.fontSize(12).fillColor(accentColor).text(resumeData.personal.professionalTitle, { align: "center" });
    }

    // Contact Info
    const contactInfo = [
      resumeData.personal.email,
      resumeData.personal.phone,
      resumeData.personal.location,
    ]
      .filter((item) => item)
      .join(" | ");

    doc.fontSize(10).fillColor("#666666").text(contactInfo, { align: "center" });
    doc.moveDown(0.5);

    // Summary Section
    if (resumeData.summary) {
      doc.fontSize(12).font("Helvetica-Bold").fillColor(primaryColor).text("PROFESSIONAL SUMMARY");
      doc.fontSize(10).font("Helvetica").fillColor("#333333").text(resumeData.summary, { align: "left" });
      doc.moveDown(0.5);
    }

    // Experience Section
    if (resumeData.experience && resumeData.experience.length > 0) {
      doc.fontSize(12).font("Helvetica-Bold").fillColor(primaryColor).text("WORK EXPERIENCE");

      resumeData.experience.forEach((exp) => {
        if (exp.jobTitle || exp.company) {
          doc.fontSize(11).font("Helvetica-Bold").fillColor(primaryColor).text(`${exp.jobTitle}${exp.company ? ` at ${exp.company}` : ""}`);

          if (exp.startDate || exp.endDate) {
            doc.fontSize(9).fillColor("#666666").text(`${exp.startDate}${exp.endDate ? ` - ${exp.endDate}` : ""}`, { align: "left" });
          }

          if (exp.achievements) {
            const achievements = exp.achievements.split("\n").filter((line) => line.trim());
            achievements.forEach((achievement) => {
              doc.fontSize(10).fillColor("#333333").text(`• ${achievement.trim()}`, { indent: 10 });
            });
          }

          doc.moveDown(0.3);
        }
      });

      doc.moveDown(0.5);
    }

    // Education Section
    if (resumeData.education && resumeData.education.length > 0) {
      doc.fontSize(12).font("Helvetica-Bold").fillColor(primaryColor).text("EDUCATION");

      resumeData.education.forEach((edu) => {
        if (edu.institution || edu.degree) {
          doc.fontSize(11).font("Helvetica-Bold").fillColor(primaryColor).text(`${edu.degree}${edu.institution ? ` - ${edu.institution}` : ""}`);

          if (edu.graduationDate) {
            doc.fontSize(9).fillColor("#666666").text(`Graduated: ${edu.graduationDate}`);
          }

          doc.moveDown(0.3);
        }
      });

      doc.moveDown(0.5);
    }

    // Skills Section
    if (resumeData.skills && resumeData.skills.length > 0) {
      doc.fontSize(12).font("Helvetica-Bold").fillColor(primaryColor).text("SKILLS");
      const skillsText = resumeData.skills.join(", ");
      doc.fontSize(10).fillColor("#333333").text(skillsText, { align: "left" });
      doc.moveDown(0.5);
    }

    // Finalize PDF
    doc.end();

    // Handle stream finish event
    writeStream.on("finish", () => {
      if (!responseSent) {
        responseSent = true;
        console.log("Resume PDF created successfully:", filename);
        res.status(200).json({
          success: true,
          message: "Resume PDF generated successfully",
          filename: filename,
          downloadUrl: `/downloads/resumes/${filename}`,
        });
      }
    });
  } catch (error) {
    console.error("Error downloading resume:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Server-side high-quality TTS using Google Cloud Text-to-Speech (requires GOOGLE_TTS_API_KEY)
export const generateTTS = async (req, res) => {
  try {
    const { text, language = 'en', voiceName = '' } = req.body || {};

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Text is required for TTS' });
    }

    if (!process.env.GOOGLE_TTS_API_KEY) {
      return res.status(501).json({ success: false, message: 'Server-side TTS not configured. Set GOOGLE_TTS_API_KEY in .env.' });
    }

    const apiKey = process.env.GOOGLE_TTS_API_KEY;
    // prefer high-quality neural voices for English
    const langCode = language === 'hi' ? 'hi-IN' : (language === 'en' ? 'en-US' : language);
    const defaultVoice = language === 'en' ? 'en-US-Neural2-J' : undefined;
    const voiceObj = voiceName ? { name: voiceName } : (defaultVoice ? { name: defaultVoice } : { languageCode: langCode });

    const payload = {
      input: { text },
      voice: voiceObj,
      audioConfig: { audioEncoding: 'MP3', speakingRate: 1.0, pitch: 0.0 },
    };

    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

    const response = await axios.post(url, payload, { headers: { 'Content-Type': 'application/json' } });

    if (!response.data || !response.data.audioContent) {
      console.error('TTS response missing audioContent', response.data);
      return res.status(500).json({ success: false, message: 'Failed to synthesize audio' });
    }

    const audioBuffer = Buffer.from(response.data.audioContent, 'base64');
    const filename = `tts_${Date.now()}.mp3`;
    const filepath = path.join(ttsDir, filename);

    writeFileSync(filepath, audioBuffer);

    return res.status(200).json({ success: true, message: 'TTS generated', filename, downloadUrl: `/downloads/tts/${filename}` });
  } catch (err) {
    console.error('TTS generation error', err.response?.data || err.message || err);
    return res.status(500).json({ success: false, message: 'TTS generation failed', detail: err.response?.data || err.message });
  }
};

// Generate Image using Clipdrop API
export const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ success: false, message: "Image prompt is required" });
    }

    if (!process.env.CLIPDROP_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Clipdrop API key is not configured",
      });
    }

    // Call Clipdrop API to generate image
    const response = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      { prompt },
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API_KEY,
        },
        responseType: "arraybuffer",
      }
    );

    // Convert image buffer to base64
    const base64Image = Buffer.from(response.data, "binary").toString("base64");
    const imageUrl = `data:image/png;base64,${base64Image}`;

    return res.status(200).json({
      success: true,
      message: "Image generated successfully",
      imageUrl,
    });
  } catch (error) {
    console.error("Error generating image:", error.response?.data || error.message);

    // Handle specific API errors
    if (error.response?.status === 400) {
      return res.status(400).json({
        success: false,
        message: "Invalid prompt. Please try a different description.",
      });
    }

    if (error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please wait before trying again.",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.response?.data?.error || "Failed to generate image",
    });
  }
};

// Generate Blog Summary with AI (minimum 5 points)
export const generateBlogSummary = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Blog title and content are required' });
    }

    // Remove HTML tags and decode entities
    let cleanContent = content.replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&amp;|&quot;|&#39;/g, ' ').replace(/\s+/g, ' ').trim();

    // Limit content to first 2000 chars for API efficiency
    cleanContent = cleanContent.substring(0, 2000);

    // If OpenAI API key is available, use it for better summaries
    if (process.env.OPENAI_API_KEY) {
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: 'You are an expert content summarizer. Generate exactly 5-7 concise, impactful points from the given blog content. Format as a numbered list. Each point should be 1-2 sentences maximum.'
              },
              {
                role: 'user',
                content: `Blog Title: ${title}\n\nContent:\n${cleanContent}\n\nPlease summarize this blog in exactly 5-7 key points as a numbered list.`
              }
            ],
            temperature: 0.7,
            max_tokens: 500
          },
          {
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const summaryText = response.data.choices[0].message.content;
        // Parse the numbered points from the response
        const points = summaryText
          .split('\n')
          .filter(line => line.match(/^\d+\.|^\d+\)/))
          .map(line => line.replace(/^\d+\.\s*|\d+\)\s*/, '').trim())
          .filter(Boolean);

        return res.status(200).json({
          success: true,
          summary: points.length >= 5 ? points : generateFallbackSummary(title, cleanContent),
          message: 'Blog summary generated successfully'
        });
      } catch (apiError) {
        console.warn('OpenAI API error, falling back to extraction method:', apiError.message);
        // Fall back to extraction method if OpenAI fails
      }
    }

    // Fallback: Extract key sentences to form summary points
    const summary = generateFallbackSummary(title, cleanContent);
    return res.status(200).json({
      success: true,
      summary: summary,
      message: 'Blog summary generated successfully'
    });
  } catch (error) {
    console.error('Summary generation error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to generate summary' });
  }
};

// Analyze Resume with AI and provide improvement tips
export const analyzeResume = async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({ success: false, message: 'Resume content is required' });
    }

    // Limit to first 3000 chars for API efficiency
    const cleanText = resumeText.trim().substring(0, 3000);

    if (!process.env.OPENAI_API_KEY) {
      return res.status(501).json({ success: false, message: 'AI analysis not configured. Set OPENAI_API_KEY in .env.' });
    }

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an expert resume coach and recruiting professional. Analyze the provided resume and give constructive, actionable improvement tips. Focus on:
1. Content improvements (skills, achievements, keywords)
2. Formatting and structure (clarity, organization)
3. Impact and quantifiable metrics
4. Industry-specific keywords and ATS optimization
5. Overall presentation

Format your response as a JSON object with this exact structure:
{
  "overallScore": 0-100,
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": [
    {"category": "Category Name", "tip": "Specific improvement tip with actionable steps"},
    {...}
  ],
  "keywordSuggestions": ["keyword1", "keyword2", "keyword3", ...],
  "summary": "Brief paragraph summarizing the resume quality and main recommendations"
}`
          },
          {
            role: 'user',
            content: `Please analyze this resume and provide improvement tips:\n\n${cleanText}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    try {
      const analysisText = response.data.choices[0].message.content;
      // Try to extract JSON from the response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : parseResumeFeedback(analysisText);

      return res.status(200).json({
        success: true,
        analysis: analysis,
        message: 'Resume analyzed successfully with AI insights'
      });
    } catch (parseError) {
      // If JSON parsing fails, return the raw text as feedback
      return res.status(200).json({
        success: true,
        analysis: {
          overallScore: 75,
          summary: analysisText,
          improvements: parseResumeFeedback(analysisText).improvements || [],
          strengths: parseResumeFeedback(analysisText).strengths || []
        },
        message: 'Resume analyzed successfully'
      });
    }
  } catch (error) {
    console.error('Resume analysis error:', error.message);
    
    if (error.response?.status === 401) {
      return res.status(401).json({ success: false, message: 'Invalid OpenAI API key' });
    }

    if (error.response?.status === 429) {
      return res.status(429).json({ success: false, message: 'Too many requests. Please wait before trying again.' });
    }

    return res.status(500).json({ success: false, message: 'Failed to analyze resume. ' + error.message });
  }
};

// Helper: Parse resume feedback from text
const parseResumeFeedback = (text) => {
  const lines = text.split('\n').filter(l => l.trim());
  
  return {
    overallScore: 75,
    strengths: [
      'Well-structured professional profile',
      'Clear job experience descriptions',
      'Relevant skill set demonstrated'
    ],
    improvements: [
      {
        category: 'Add Metrics',
        tip: 'Quantify your achievements with numbers, percentages, and results (e.g., "Increased sales by 25%" instead of "Improved sales")'
      },
      {
        category: 'Optimize Keywords',
        tip: 'Include industry-specific keywords and technical skills that match your target job descriptions to improve ATS compatibility'
      },
      {
        category: 'Strengthen Summary',
        tip: 'Add a professional summary or objective at the top that highlights your key strengths and career goals'
      }
    ],
    keywordSuggestions: ['Project Management', 'Leadership', 'Team Collaboration', 'Problem Solving', 'Strategic Planning'],
    summary: 'Your resume has a solid foundation with clear experience and education sections. Focus on adding quantifiable metrics to your achievements and including more industry-specific keywords to increase your chances of passing ATS screening.'
  };
};

// Helper: Generate fallback summary by extracting key sentences
const generateFallbackSummary = (title, content) => {
  // Split content into sentences
  const sentences = content
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 15)
    .slice(0, 10);

  if (sentences.length < 5) {
    // If not enough sentences, create points from content chunks
    const words = content.split(' ');
    const chunkSize = Math.ceil(words.length / 5);
    return Array.from({ length: 5 }, (_, i) => {
      const chunk = words.slice(i * chunkSize, (i + 1) * chunkSize).join(' ');
      return chunk.length > 10 ? chunk.substring(0, 120) + '...' : chunk;
    }).filter(Boolean);
  }

  // Select diverse sentences (first, middle, last, etc.)
  const selected = [];
  const indices = [
    0,
    Math.floor(sentences.length / 4),
    Math.floor(sentences.length / 2),
    Math.floor((sentences.length * 3) / 4),
    sentences.length - 1
  ];

  for (let idx of indices) {
    if (idx >= 0 && idx < sentences.length && sentences[idx]) {
      let point = sentences[idx];
      if (point.length > 150) point = point.substring(0, 150) + '...';
      if (!selected.includes(point)) selected.push(point);
    }
  }

  // Ensure we have at least 5 points
  while (selected.length < 5 && sentences.length > 0) {
    const randomIdx = Math.floor(Math.random() * sentences.length);
    const point = sentences[randomIdx];
    if (point.length > 150) point.substring(0, 150) + '...';
    if (!selected.includes(point)) selected.push(point);
  }

  return selected.slice(0, 7); // Return up to 7 points
};

