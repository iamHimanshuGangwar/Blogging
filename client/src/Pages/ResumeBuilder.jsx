// client/src/pages/ResumeBuilder.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  User,
  Briefcase,
  Code,
  Download,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  Award,
  Globe,
  Heart,
  FolderOpen,
  Trash2,
  Plus,
  Save,
  RotateCcw,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import ProfileSidebar from "../components/ProfileSidebar";

/* ---------------- LIVE PREVIEW TEMPLATES ---------------- */

const RESUME_TEMPLATES = {
  professional: "Professional",
  modern: "Modern",
  creative: "Creative",
  minimal: "Minimal",
  classic: "Classic",
};

const LiveResumePreview = ({ data, theme, template = "professional" }) => {
  // MyPerfectResume inspired professional theme
  const bgClass = "bg-white text-gray-900";
  const accentColor = "blue";
  const accentClass = "text-blue-700 border-blue-700";

  const renderSection = (title, content) => {
    if (!content || (Array.isArray(content) && !content.length)) return null;
    return (
      <section className="mb-5">
        <h2 className={`text-sm font-bold uppercase tracking-widest ${accentClass} border-b-2 pb-2 mb-3`}>{title}</h2>
        {content}
      </section>
    );
  };

  return (
    <div className={`h-full p-8 overflow-y-auto rounded-lg shadow-sm ${bgClass} space-y-4 bg-white text-gray-800 border border-gray-200`}>
      {/* Header */}
      <header className="pb-3 border-b border-gray-300">
        <h1 className="text-3xl font-bold text-gray-900">{data.personal.fullName || "Your Name"}</h1>
        <p className={`text-xs mt-1 ${accentClass} font-semibold`}>
          {data.personal.professionalTitle || "Professional Title"}
        </p>
        <p className="text-xs text-gray-600 mt-2 font-medium">
          {[data.personal.email, data.personal.phone, data.personal.location]
            .filter(Boolean)
            .join(" • ")}
        </p>
        {data.personal.website && (
          <p className="text-xs text-gray-600 mt-1">🌐 {data.personal.website}</p>
        )}
      </header>

      {/* Summary */}
      {renderSection(
        "Summary",
        <p className="text-xs leading-relaxed whitespace-pre-wrap text-gray-800">
          {data.summary || ""}
        </p>
      )}

      {/* Experience */}
      {renderSection(
        "Experience",
        <div className="space-y-3">
          {data.experience
            .filter((e) => e.jobTitle && e.company)
            .map((exp, i) => (
              <div key={i} className="space-y-0">
                <p className="font-bold text-xs text-gray-900">{exp.jobTitle}</p>
                <p className={`text-xs font-semibold ${accentClass}`}>{exp.company}</p>
                <p className="text-xs text-gray-600">
                  {exp.startDate} - {exp.endDate || "Present"}
                </p>
                {exp.achievements && (
                  <ul className="list-disc ml-4 text-xs space-y-1 mt-2 text-gray-800">
                    {exp.achievements
                      .split("\n")
                      .filter(Boolean)
                      .map((a, idx) => (
                        <li key={idx}>{a}</li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
        </div>
      )}

      {/* Education */}
      {renderSection(
        "Education",
        <div className="space-y-3">
          {data.education
            .filter((e) => e.school && e.degree)
            .map((edu, i) => (
              <div key={i} className="space-y-0">
                <p className="font-bold text-xs text-gray-900">{edu.degree}</p>
                <p className={`text-xs font-semibold ${accentClass}`}>{edu.school}</p>
                <p className="text-xs text-gray-600">{edu.graduationDate}</p>
                {edu.field && (
                  <p className="text-xs text-gray-800">Field: {edu.field}</p>
                )}
              </div>
            ))}
        </div>
      )}

      {/* Skills */}
      {renderSection(
        "Skills",
        <div className="flex flex-wrap gap-2">
          {data.skills.length ? (
            data.skills.map((s, i) => (
              <span
                key={i}
                className={`px-2 py-1 text-xs rounded bg-blue-50 text-blue-700 border border-blue-200`}
              >
                {s}
              </span>
            ))
          ) : (
            <p className="text-xs">-</p>
          )}
        </div>
      )}

      {/* Certifications */}
      {renderSection(
        "Certifications",
        <div className="space-y-2">
          {data.certifications
            .filter((c) => c.name)
            .map((cert, i) => (
              <div key={i} className="space-y-0">
                <p className="font-bold text-xs text-gray-900">{cert.name}</p>
                {cert.issuer && (
                  <p className={`text-xs font-semibold ${accentClass}`}>{cert.issuer}</p>
                )}
                {cert.date && (
                  <p className="text-xs text-gray-600">{cert.date}</p>
                )}
              </div>
            ))}
        </div>
      )}

      {/* Languages */}
      {renderSection(
        "Languages",
        <div className="flex flex-wrap gap-3">
          {data.languages
            .filter((l) => l.language)
            .map((lang, i) => (
              <div key={i} className="text-xs">
                <span className="font-semibold text-gray-900">{lang.language}</span> - <span className="text-gray-700">{lang.proficiency}</span>
              </div>
            ))}
        </div>
      )}

      {/* Volunteering */}
      {renderSection(
        "Volunteering",
        <div className="space-y-3">
          {data.volunteering
            .filter((v) => v.organization)
            .map((vol, i) => (
              <div key={i} className="space-y-0">
                <p className="font-bold text-xs text-gray-900">{vol.role || "Volunteer"}</p>
                <p className={`text-xs font-semibold ${accentClass}`}>{vol.organization}</p>
                <p className="text-xs text-gray-600">
                  {vol.startDate} - {vol.endDate || "Present"}
                </p>
                {vol.description && (
                  <p className="text-xs text-gray-800">{vol.description}</p>
                )}
              </div>
            ))}
        </div>
      )}

      {/* Projects */}
      {renderSection(
        "Projects",
        <div className="space-y-3">
          {data.projects
            .filter((p) => p.title)
            .map((proj, i) => (
              <div key={i} className="space-y-0">
                <p className="font-bold text-xs text-gray-900">{proj.title}</p>
                {proj.link && (
                  <p className="text-xs text-blue-600">🔗 {proj.link}</p>
                )}
                {proj.description && (
                  <p className="text-xs text-gray-800">{proj.description}</p>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

/* ---------------- MAIN COMPONENT ---------------- */

// Occupation data
const OCCUPATIONS = [
  "Accounting", "Advertising", "Agriculture", "Architecture", "Art & Design",
  "Business", "Construction", "Consulting", "Customer Service", "Data Science",
  "Education", "Engineering", "Entertainment", "Finance", "Food Service",
  "Healthcare", "Human Resources", "IT & Technology", "Law", "Management",
  "Marketing", "Manufacturing", "Media", "Nursing", "Operations",
  "Project Management", "Real Estate", "Retail", "Sales", "Supply Chain"
];

// Template designs
const TEMPLATE_DESIGNS = [
  {
    id: "professional",
    name: "Professional",
    description: "Clean and corporate",
    preview: "🔵",
    occupations: ["Accounting", "Finance", "Law", "Consulting", "Management"]
  },
  {
    id: "modern",
    name: "Modern",
    description: "Contemporary design",
    preview: "🟢",
    occupations: ["IT & Technology", "Data Science", "Engineering", "Design"]
  },
  {
    id: "creative",
    name: "Creative",
    description: "Bold and artistic",
    preview: "🟣",
    occupations: ["Art & Design", "Media", "Entertainment", "Marketing"]
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple and elegant",
    preview: "⚪",
    occupations: ["Architecture", "Education", "Business"]
  },
  {
    id: "executive",
    name: "Executive",
    description: "Premium and sophisticated",
    preview: "🟠",
    occupations: ["Management", "Consulting", "Business"]
  },
  {
    id: "healthcare",
    name: "Healthcare",
    description: "Medical-focused layout",
    preview: "🔴",
    occupations: ["Healthcare", "Nursing"]
  },
];

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const { axios, token, theme } = useAppContext();

  // Page navigation states
  const [currentPage, setCurrentPage] = useState("template-selection"); // template-selection, evaluative-feedback, form-builder
  const [showTemplateSelection, setShowTemplateSelection] = useState(true);
  const [selectedPath, setSelectedPath] = useState(null);
  const [showPathContent, setShowPathContent] = useState(false);
  const [step, setStep] = useState(0);
  const [template, setTemplate] = useState("professional");
  const [loading, setLoading] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [uploadedResume, setUploadedResume] = useState(null);
  const [selectedOccupation, setSelectedOccupation] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("professional");
  const [filteredTemplates, setFilteredTemplates] = useState(TEMPLATE_DESIGNS);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [analyzingResume, setAnalyzingResume] = useState(false);

  const [resumeData, setResumeData] = useState({
    personal: {
      fullName: "",
      professionalTitle: "",
      email: "",
      phone: "",
      location: "",
      website: "",
    },
    summary: "",
    experience: [
      { jobTitle: "", company: "", startDate: "", endDate: "", achievements: "" },
    ],
    education: [{ degree: "", school: "", field: "", graduationDate: "" }],
    skills: [],
    certifications: [{ name: "", issuer: "", date: "" }],
    languages: [{ language: "", proficiency: "" }],
    volunteering: [
      { role: "", organization: "", startDate: "", endDate: "", description: "" },
    ],
    projects: [{ title: "", description: "", link: "" }],
  });

  // Questionnaire states
  const [experienceLevel, setExperienceLevel] = useState("");
  const [isStudent, setIsStudent] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [showTemplateFilters, setShowTemplateFilters] = useState(false);

  // Template filter states
  const [hasPhoto, setHasPhoto] = useState(true);
  const [columns, setColumns] = useState(1);

  // Load saved resume from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("resumeDraft");
    if (saved) {
      try {
        setResumeData(JSON.parse(saved));
        toast.success("Resumed previous work");
      } catch (e) {
        console.error("Failed to load saved resume");
      }
    }
  }, []);

  // Handle occupation selection
  const handleOccupationSelect = (occupation) => {
    setSelectedOccupation(occupation);
    const recommended = TEMPLATE_DESIGNS.filter((t) =>
      t.occupations.includes(occupation)
    );
    setFilteredTemplates(recommended.length > 0 ? recommended : TEMPLATE_DESIGNS);
    // Show questionnaire after occupation selection
    setShowPathContent(false);
    setShowQuestionnaire(true);
  };

  // Handle style selection
  const handleStyleSelect = (styleId) => {
    setSelectedStyle(styleId);
    setTemplate(styleId);
  };

  // Handle questionnaire completion
  const handleQuestionnaireComplete = () => {
    if (!experienceLevel || isStudent === "" || !educationLevel) {
      toast.error("Please fill in all fields");
      return;
    }
    setShowQuestionnaire(false);
    setShowTemplateFilters(true);
  };

  // Handle template filters completion
  const handleFiltersComplete = () => {
    setShowTemplateFilters(false);
    setShowPathContent(true);
    setSelectedPath("style");
  };

  // Handle resume upload
  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedResume(file);
      toast.success("Resume uploaded! Analyzing with AI...");
      
      // Extract text from file and analyze
      setAnalyzingResume(true);
      try {
        const fileText = await extractTextFromFile(file);
        
        if (fileText && fileText.trim().length > 20) {
          // Call AI resume analysis API
          const response = await axios.post('/api/ai/resume/analyze', {
            resumeText: fileText
          });
          
          if (response.data.success) {
            setAnalysis(response.data.analysis);
            setShowAnalysis(true);
            toast.success("Resume analysis complete!");
          }
        } else {
          toast.error("Could not extract text from file. Please use a text file or try pasting content.");
        }
      } catch (error) {
        console.error("Error analyzing resume:", error);
        toast.error("Failed to analyze resume. Please try again.");
      } finally {
        setAnalyzingResume(false);
      }
      
      // Auto-suggest professional template for uploaded resumes
      setFilteredTemplates(TEMPLATE_DESIGNS.slice(0, 3));
    }
  };

  // Extract text from uploaded file
  const extractTextFromFile = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target?.result;
        
        if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
          // Plain text file
          resolve(content);
        } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
          // For PDF, we'd need pdf-parse library - for now return indication
          toast("PDF support requires additional setup. Please use .txt or paste content.");
          resolve("");
        } else if (file.type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
          // For DOCX, we'd need docx library - for now return indication
          toast("DOCX support requires additional setup. Please use .txt or paste content.");
          resolve("");
        } else {
          // Try to read as text
          resolve(content);
        }
      };
      
      reader.onerror = () => {
        resolve("");
      };
      
      // Read as text
      reader.readAsText(file);
    });
  };

  // Handler to continue from path selection
  const handleContinueWithPath = () => {
    if (selectedPath === "style" && !selectedStyle) {
      toast.error("Please select a template style");
      return;
    }
    if (selectedPath === "occupation" && !selectedOccupation) {
      toast.error("Please select an occupation");
      return;
    }
    if (selectedPath === "upload" && !uploadedResume) {
      toast.error("Please upload a resume");
      return;
    }
    
    // If upload path and analysis available, show evaluative feedback
    if (selectedPath === "upload" && analysis) {
      setShowTemplateSelection(false);
      setShowPathContent(false);
      setCurrentPage("evaluative-feedback");
      return;
    }
    
    // Otherwise go directly to form builder
    setShowTemplateSelection(false);
    setShowPathContent(false);
    setCurrentPage("form-builder");
    setStep(0);
  };

  // Helper Functions
  const updatePersonal = (k, v) =>
    setResumeData((p) => ({ ...p, personal: { ...p.personal, [k]: v } }));

  const updateExperience = (i, k, v) => {
    const copy = [...resumeData.experience];
    copy[i][k] = v;
    setResumeData((p) => ({ ...p, experience: copy }));
  };

  const addExperience = () =>
    setResumeData((p) => ({
      ...p,
      experience: [
        ...p.experience,
        { jobTitle: "", company: "", startDate: "", endDate: "", achievements: "" },
      ],
    }));

  const removeExperience = (i) =>
    setResumeData((p) => ({
      ...p,
      experience: p.experience.filter((_, idx) => idx !== i),
    }));

  // Education
  const updateEducation = (i, k, v) => {
    const copy = [...resumeData.education];
    copy[i][k] = v;
    setResumeData((p) => ({ ...p, education: copy }));
  };

  const addEducation = () =>
    setResumeData((p) => ({
      ...p,
      education: [...p.education, { degree: "", school: "", field: "", graduationDate: "" }],
    }));

  const removeEducation = (i) =>
    setResumeData((p) => ({
      ...p,
      education: p.education.filter((_, idx) => idx !== i),
    }));

  // Certifications
  const updateCertification = (i, k, v) => {
    const copy = [...resumeData.certifications];
    copy[i][k] = v;
    setResumeData((p) => ({ ...p, certifications: copy }));
  };

  const addCertification = () =>
    setResumeData((p) => ({
      ...p,
      certifications: [...p.certifications, { name: "", issuer: "", date: "" }],
    }));

  const removeCertification = (i) =>
    setResumeData((p) => ({
      ...p,
      certifications: p.certifications.filter((_, idx) => idx !== i),
    }));

  // Languages
  const updateLanguage = (i, k, v) => {
    const copy = [...resumeData.languages];
    copy[i][k] = v;
    setResumeData((p) => ({ ...p, languages: copy }));
  };

  const addLanguage = () =>
    setResumeData((p) => ({
      ...p,
      languages: [...p.languages, { language: "", proficiency: "" }],
    }));

  const removeLanguage = (i) =>
    setResumeData((p) => ({
      ...p,
      languages: p.languages.filter((_, idx) => idx !== i),
    }));

  // Volunteering
  const updateVolunteering = (i, k, v) => {
    const copy = [...resumeData.volunteering];
    copy[i][k] = v;
    setResumeData((p) => ({ ...p, volunteering: copy }));
  };

  const addVolunteering = () =>
    setResumeData((p) => ({
      ...p,
      volunteering: [
        ...p.volunteering,
        { role: "", organization: "", startDate: "", endDate: "", description: "" },
      ],
    }));

  const removeVolunteering = (i) =>
    setResumeData((p) => ({
      ...p,
      volunteering: p.volunteering.filter((_, idx) => idx !== i),
    }));

  // Projects
  const updateProject = (i, k, v) => {
    const copy = [...resumeData.projects];
    copy[i][k] = v;
    setResumeData((p) => ({ ...p, projects: copy }));
  };

  const addProject = () =>
    setResumeData((p) => ({
      ...p,
      projects: [...p.projects, { title: "", description: "", link: "" }],
    }));

  const removeProject = (i) =>
    setResumeData((p) => ({
      ...p,
      projects: p.projects.filter((_, idx) => idx !== i),
    }));

  const handleDownload = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "/api/ai/resume/download",
        { resumeData },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.data?.success || !res.data?.downloadUrl) {
        throw new Error("Invalid download response");
      }

      const baseURL = axios.defaults.baseURL || window.location.origin;
      const fileURL = res.data.downloadUrl.startsWith("http")
        ? res.data.downloadUrl
        : `${baseURL}${res.data.downloadUrl}`;

      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", "resume.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Resume downloaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to clear all data?")) {
      setResumeData({
        personal: {
          fullName: "",
          professionalTitle: "",
          email: "",
          phone: "",
          location: "",
          website: "",
        },
        summary: "",
        experience: [
          { jobTitle: "", company: "", startDate: "", endDate: "", achievements: "" },
        ],
        education: [{ degree: "", school: "", field: "", graduationDate: "" }],
        skills: [],
        certifications: [{ name: "", issuer: "", date: "" }],
        languages: [{ language: "", proficiency: "" }],
        volunteering: [
          {
            role: "",
            organization: "",
            startDate: "",
            endDate: "",
            description: "",
          },
        ],
        projects: [{ title: "", description: "", link: "" }],
      });
      localStorage.removeItem("resumeDraft");
      toast.success("Resume cleared");
    }
  };

  // Step Configuration
  const steps = [
    {
      title: "Personal Information",
      icon: User,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-gray-700">
            <strong>💡 Tip:</strong> Include your professional contact information and website or LinkedIn URL.
          </div>
          {[
            ["fullName", "Full Name *", "John Doe"],
            ["professionalTitle", "Professional Title", "Software Engineer"],
            ["email", "Email *", "john@example.com"],
            ["phone", "Phone Number","+1 (555) 123-4567"],
            ["location", "Location", "New York, NY"],
            ["website", "Website/Portfolio", "https://johndoe.com"],
          ].map(([k, label, placeholder]) => (
            <div key={k}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
              <input
                placeholder={placeholder}
                value={resumeData.personal[k]}
                onChange={(e) => updatePersonal(k, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Professional Summary",
      icon: FileText,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-gray-700">
            <strong>💡 Tip:</strong> Write 2-3 sentences that highlight your key strengths and career goals.
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Professional Summary</label>
            <textarea
              rows={6}
              placeholder="Experienced software engineer with 5+ years in full-stack development. Proven expertise in React, Node.js, and cloud technologies. Seeking to leverage technical skills and leadership abilities..."
              value={resumeData.summary}
              onChange={(e) =>
                setResumeData((p) => ({ ...p, summary: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Work Experience",
      icon: Briefcase,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-gray-700">
            <strong>💡 Tip:</strong> Use action verbs and include quantifiable achievements (e.g., "increased sales by 30%").
          </div>
          {resumeData.experience.map((exp, i) => (
            <div
              key={i}
              className="p-5 border border-gray-300 rounded-lg space-y-3 bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-gray-800">Position #{i + 1}</h4>
                {resumeData.experience.length > 1 && (
                  <button
                    onClick={() => removeExperience(i)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Job Title *</label>
                <input
                  placeholder="Senior Software Engineer"
                  value={exp.jobTitle}
                  onChange={(e) => updateExperience(i, "jobTitle", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Company *</label>
                <input
                  placeholder="Tech Company Inc."
                  value={exp.company}
                  onChange={(e) => updateExperience(i, "company", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
                  <input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) =>
                      updateExperience(i, "startDate", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
                  <input
                    type="month"
                    value={exp.endDate}
                    onChange={(e) =>
                      updateExperience(i, "endDate", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Key Achievements (one per line)</label>
                <textarea
                  rows={3}
                  placeholder="Led development of new feature...&#10;Improved system performance by 40%...&#10;Mentored 3 junior developers..."
                  value={exp.achievements}
                  onChange={(e) =>
                    updateExperience(i, "achievements", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
          <button
            onClick={addExperience}
            className="w-full py-2.5 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 flex items-center justify-center gap-2 font-semibold transition"
          >
            <Plus size={18} /> Add Another Position
          </button>
        </div>
      ),
    },
    {
      title: "Education",
      icon: GraduationCap,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-gray-700">
            <strong>💡 Tip:</strong> List all degrees in reverse chronological order (most recent first).
          </div>
          {resumeData.education.map((edu, i) => (
            <div
              key={i}
              className="p-5 border border-gray-300 rounded-lg space-y-3 bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-gray-800">Education #{i + 1}</h4>
                {resumeData.education.length > 1 && (
                  <button
                    onClick={() => removeEducation(i)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Degree *</label>
                <input
                  placeholder="Bachelor of Science"
                  value={edu.degree}
                  onChange={(e) => updateEducation(i, "degree", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">School/University *</label>
                <input
                  placeholder="University Name"
                  value={edu.school}
                  onChange={(e) => updateEducation(i, "school", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Field of Study</label>
                <input
                  placeholder="Computer Science"
                  value={edu.field}
                  onChange={(e) => updateEducation(i, "field", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Graduation Date</label>
                <input
                  type="month"
                  value={edu.graduationDate}
                  onChange={(e) =>
                    updateEducation(i, "graduationDate", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
          <button
            onClick={addEducation}
            className="w-full py-2.5 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 flex items-center justify-center gap-2 font-semibold transition"
          >
            <Plus size={18} /> Add Another School
          </button>
        </div>
      ),
    },
    {
      title: "Skills",
      icon: Code,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-gray-700">
            <strong>💡 Tip:</strong> Include 5-10 relevant skills. Use keywords from the job description.
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Enter Your Skills</label>
            <input
              placeholder="React, Node.js, Python, Project Management, AWS..."
              value={resumeData.skills.join(", ")}
              onChange={(e) =>
                setResumeData((p) => ({
                  ...p,
                  skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-600 mt-2">Separate skills with commas</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Your Skills</label>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill, i) => (
                <div
                  key={i}
                  className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm border border-blue-300 flex items-center gap-2"
                >
                  {skill}
                  <button
                    onClick={() =>
                      setResumeData((p) => ({
                        ...p,
                        skills: p.skills.filter((_, idx) => idx !== i),
                      }))
                    }
                    className="hover:text-blue-900 font-bold"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Certifications",
      icon: Award,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-gray-700">
            <strong>💡 Tip:</strong> Include relevant certifications, licenses, and professional achievements.
          </div>
          {resumeData.certifications.map((cert, i) => (
            <div
              key={i}
              className="p-5 border border-gray-300 rounded-lg space-y-3 bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-gray-800">Certification #{i + 1}</h4>
                {resumeData.certifications.length > 1 && (
                  <button
                    onClick={() => removeCertification(i)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Certification Name *</label>
                <input
                  placeholder="AWS Certified Solutions Architect"
                  value={cert.name}
                  onChange={(e) =>
                    updateCertification(i, "name", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Issuing Organization</label>
                <input
                  placeholder="Amazon Web Services"
                  value={cert.issuer}
                  onChange={(e) =>
                    updateCertification(i, "issuer", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Issue Date</label>
                <input
                  type="month"
                  value={cert.date}
                  onChange={(e) => updateCertification(i, "date", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
          <button
            onClick={addCertification}
            className="w-full py-2.5 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 flex items-center justify-center gap-2 font-semibold transition"
          >
            <Plus size={18} /> Add Certification
          </button>
        </div>
      ),
    },
    {
      title: "Languages",
      icon: Globe,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-gray-700">
            <strong>💡 Tip:</strong> List languages with your proficiency level to show global capabilities.
          </div>
          {resumeData.languages.map((lang, i) => (
            <div
              key={i}
              className="p-5 border border-gray-300 rounded-lg space-y-3 bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-gray-800">Language #{i + 1}</h4>
                {resumeData.languages.length > 1 && (
                  <button
                    onClick={() => removeLanguage(i)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Language *</label>
                <input
                  placeholder="English, Spanish, Mandarin..."
                  value={lang.language}
                  onChange={(e) =>
                    updateLanguage(i, "language", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Proficiency Level</label>
                <select
                  value={lang.proficiency}
                  onChange={(e) =>
                    updateLanguage(i, "proficiency", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Proficiency</option>
                  <option value="Elementary">Elementary</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Fluent">Fluent</option>
                  <option value="Native">Native</option>
                </select>
              </div>
            </div>
          ))}
          <button
            onClick={addLanguage}
            className="w-full py-2.5 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 flex items-center justify-center gap-2 font-semibold transition"
          >
            <Plus size={18} /> Add Language
          </button>
        </div>
      ),
    },
    {
      title: "Volunteering",
      icon: Heart,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-gray-700">
            <strong>💡 Tip:</strong> Include volunteer work to show community involvement and leadership.
          </div>
          {resumeData.volunteering.map((vol, i) => (
            <div
              key={i}
              className="p-5 border border-gray-300 rounded-lg space-y-3 bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-gray-800">Volunteer Role #{i + 1}</h4>
                {resumeData.volunteering.length > 1 && (
                  <button
                    onClick={() => removeVolunteering(i)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                <input
                  placeholder="Volunteer Coordinator"
                  value={vol.role}
                  onChange={(e) =>
                    updateVolunteering(i, "role", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Organization *</label>
                <input
                  placeholder="Non-profit Organization"
                  value={vol.organization}
                  onChange={(e) =>
                    updateVolunteering(i, "organization", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
                  <input
                    type="month"
                    value={vol.startDate}
                    onChange={(e) =>
                      updateVolunteering(i, "startDate", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
                  <input
                    type="month"
                    value={vol.endDate}
                    onChange={(e) =>
                      updateVolunteering(i, "endDate", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe your contributions and impact..."
                  value={vol.description}
                  onChange={(e) =>
                    updateVolunteering(i, "description", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
          <button
            onClick={addVolunteering}
            className="w-full py-2.5 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 flex items-center justify-center gap-2 font-semibold transition"
          >
            <Plus size={18} /> Add Volunteer Experience
          </button>
        </div>
      ),
    },
    {
      title: "Projects & Portfolio",
      icon: FolderOpen,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-gray-700">
            <strong>💡 Tip:</strong> Link to your GitHub, portfolio, or live projects to showcase your work.
          </div>
          {resumeData.projects.map((proj, i) => (
            <div
              key={i}
              className="p-5 border border-gray-300 rounded-lg space-y-3 bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-gray-800">Project #{i + 1}</h4>
                {resumeData.projects.length > 1 && (
                  <button
                    onClick={() => removeProject(i)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Project Title *</label>
                <input
                  placeholder="E-Commerce Platform"
                  value={proj.title}
                  onChange={(e) => updateProject(i, "title", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Built a full-stack e-commerce application using React and Node.js..."
                  value={proj.description}
                  onChange={(e) =>
                    updateProject(i, "description", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Project Link</label>
                <input
                  placeholder="https://github.com/yourname/project"
                  value={proj.link}
                  onChange={(e) => updateProject(i, "link", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
          <button
            onClick={addProject}
            className="w-full py-2.5 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 flex items-center justify-center gap-2 font-semibold transition"
          >
            <Plus size={18} /> Add Project
          </button>
        </div>
      ),
    },
    {
      title: "Download & Finish",
      icon: Download,
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-gray-700">
            <strong>✅ Ready to Download!</strong> Your resume is complete and ready to be exported as a PDF. Download it now and start applying for jobs!
          </div>
          <button
            onClick={handleDownload}
            disabled={loading || !resumeData.personal.fullName}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition text-lg"
          >
            {loading ? "Generating PDF..." : <><Download size={24} /> Download My Resume</>}
          </button>
          <button
            onClick={handleReset}
            className="w-full py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 flex items-center justify-center gap-2 transition font-semibold"
          >
            <RotateCcw size={18} /> Clear All Data
          </button>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 space-y-2">
            <p><strong>💡 Next Steps:</strong></p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Download your resume in PDF format</li>
              <li>Keep a Word version for custom edits</li>
              <li>Tailor your resume for each job application</li>
              <li>Proofread carefully before submitting</li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  const CurrentIcon = steps[step]?.icon || FileText;

  // Template Selection Component
  if (showTemplateSelection) {
    // Show specific path content
    if (showPathContent && selectedPath === "upload") {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12">
          <div className="max-w-2xl mx-auto px-4">
            <button
              onClick={() => setShowPathContent(false)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-8"
            >
              <ArrowLeft size={20} /> Back
            </button>

            <div className="bg-white rounded-2xl shadow-xl p-12 space-y-8">
              <div className="text-center space-y-3">
                <h2 className="text-4xl font-bold text-gray-900">Upload Your Resume</h2>
                <p className="text-gray-600 text-lg">
                  Upload your existing resume and we'll suggest templates that match its style
                </p>
              </div>

              {/* Upload Area */}
              <div
                className="border-3 border-dashed border-blue-300 rounded-2xl p-12 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition relative"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleResumeUpload({ target: { files: e.dataTransfer.files } });
                }}
              >
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleResumeUpload}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload" className="cursor-pointer space-y-3">
                  <div className="text-5xl">📄</div>
                  <h3 className="font-bold text-gray-900 text-xl">
                    {uploadedResume ? uploadedResume.name : "Drag and drop your resume"}
                  </h3>
                  <p className="text-gray-600">
                    or click to browse (PDF, DOC, DOCX, TXT)
                  </p>
                </label>
              </div>

              {/* Suggested Templates */}
              {uploadedResume && (
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 text-lg">Recommended Templates</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredTemplates.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => handleStyleSelect(t.id)}
                        className={`p-4 rounded-xl border-2 transition ${
                          selectedStyle === t.id
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <div className="text-4xl mb-2">{t.preview}</div>
                        <h4 className="font-bold text-gray-900">{t.name}</h4>
                        <p className="text-sm text-gray-600">{t.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleContinueWithPath}
                disabled={!uploadedResume}
                className="w-full py-3 px-6 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white rounded-full font-bold text-lg transition"
              >
                Continue with Selected Template
              </button>

              {/* AI Analysis Loading */}
              {analyzingResume && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                  <div className="flex justify-center mb-3">
                    <div className="animate-spin inline-block">
                      <div className="text-4xl">🤖</div>
                    </div>
                  </div>
                  <p className="text-gray-700 font-semibold">Analyzing your resume with AI...</p>
                  <p className="text-sm text-gray-600 mt-2">This may take a few seconds</p>
                </div>
              )}
            </div>
          </div>

          {/* AI Analysis Modal */}
          {showAnalysis && analysis && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-teal-600 text-white p-6 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">✨</div>
                    <h2 className="text-2xl font-bold">AI Resume Analysis</h2>
                  </div>
                  <button
                    onClick={() => setShowAnalysis(false)}
                    className="text-white hover:bg-white/20 rounded-full p-2 transition"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-8 space-y-6">
                  {/* Overall Score */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Resume Score</p>
                        <p className="text-5xl font-bold text-green-600 mt-2">{analysis.overallScore || 75}/100</p>
                      </div>
                      <div className="text-6xl">📊</div>
                    </div>
                  </div>

                  {/* Summary */}
                  {analysis.summary && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-gray-900">Summary</h3>
                      <p className="text-gray-700 leading-relaxed">{analysis.summary}</p>
                    </div>
                  )}

                  {/* Strengths */}
                  {analysis.strengths && analysis.strengths.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <span className="text-2xl">💪</span> Strengths
                      </h3>
                      <div className="space-y-2">
                        {analysis.strengths.map((strength, idx) => (
                          <div key={idx} className="flex gap-3 bg-green-50 p-3 rounded-lg border border-green-200">
                            <span className="text-xl">✓</span>
                            <p className="text-gray-700">{strength}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Improvements */}
                  {analysis.improvements && analysis.improvements.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <span className="text-2xl">🎯</span> Areas to Improve
                      </h3>
                      <div className="space-y-3">
                        {analysis.improvements.map((improvement, idx) => (
                          <div key={idx} className="border-l-4 border-orange-400 bg-orange-50 p-4 rounded-lg">
                            <h4 className="font-bold text-gray-900">{improvement.category}</h4>
                            <p className="text-sm text-gray-700 mt-1">{improvement.tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Keyword Suggestions */}
                  {analysis.keywordSuggestions && analysis.keywordSuggestions.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <span className="text-2xl">🏷️</span> Keywords to Add
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {analysis.keywordSuggestions.map((keyword, idx) => (
                          <span key={idx} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    onClick={() => setShowAnalysis(false)}
                    className="w-full py-3 px-6 bg-teal-600 hover:bg-teal-700 text-white rounded-full font-bold text-lg transition"
                  >
                    Continue to Resume Builder
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Questionnaire Page
    if (showQuestionnaire) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12">
          <div className="max-w-2xl mx-auto px-4">
            <button
              onClick={() => {
                setShowQuestionnaire(false);
                setShowPathContent(true);
                setSelectedPath("occupation");
                setExperienceLevel("");
                setIsStudent("");
                setEducationLevel("");
              }}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-8"
            >
              <ArrowLeft size={20} /> Back
            </button>

            <div className="bg-white rounded-2xl shadow-xl p-12 space-y-12">
              {/* Experience Level */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">How long have you been working?</h2>
                  <p className="text-gray-600 mt-2">We'll find the best templates for your experience level.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {["No Experience", "Less Than 3 Years", "3-5 Years", "5-10 Years", "10+ Years"].map((level) => (
                    <button
                      key={level}
                      onClick={() => setExperienceLevel(level)}
                      className={`py-3 px-4 rounded-lg border-2 font-semibold transition ${
                        experienceLevel === level
                          ? "border-blue-600 bg-blue-50 text-blue-600"
                          : "border-gray-300 text-gray-700 hover:border-blue-400"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Student Status */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Are you a student?</h2>
                </div>
                <div className="flex gap-4">
                  {["Yes", "No"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setIsStudent(status)}
                      className={`flex-1 py-3 px-6 rounded-lg border-2 font-semibold transition ${
                        isStudent === status
                          ? "border-blue-600 bg-blue-50 text-blue-600"
                          : "border-gray-300 text-gray-700 hover:border-blue-400"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Education Level */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">What education level are you currently pursuing?</h2>
                  <p className="text-gray-600 mt-2">Select the highest level you are working toward so we can organize your resume correctly.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {["Secondary School", "Vocational Certificate or Diploma", "Apprenticeship or Internship Training", "Bachelor's Degree", "Master's Degree", "Doctorate or Higher"].map((education) => (
                    <button
                      key={education}
                      onClick={() => setEducationLevel(education)}
                      className={`py-3 px-4 rounded-lg border-2 font-semibold transition text-sm ${
                        educationLevel === education
                          ? "border-blue-600 bg-blue-50 text-blue-600"
                          : "border-gray-300 text-gray-700 hover:border-blue-400"
                      }`}
                    >
                      {education}
                    </button>
                  ))}
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={handleQuestionnaireComplete}
                className="w-full py-3 px-6 bg-teal-600 hover:bg-teal-700 text-white rounded-full font-bold text-lg transition"
              >
                Continue to Template Selection
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Template Filters Page
    if (showTemplateFilters) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12">
          <div className="max-w-6xl mx-auto px-4">
            <button
              onClick={() => {
                setShowTemplateFilters(false);
                setShowQuestionnaire(true);
              }}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-8"
            >
              <ArrowLeft size={20} /> Back
            </button>

            <div className="bg-white rounded-2xl shadow-xl p-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left: Filters */}
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Filters</h2>
                    <button className="text-blue-600 hover:text-blue-700 font-semibold mb-6">Clear filters</button>
                  </div>

                  {/* Headshot Filter */}
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3 uppercase text-sm">HEADSHOT</h3>
                    <div className="space-y-2">
                      {["With photo", "Without photo"].map((option) => (
                        <label key={option} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={option === "With photo" ? hasPhoto : !hasPhoto}
                            onChange={() => option === "With photo" ? setHasPhoto(!hasPhoto) : setHasPhoto(true)}
                            className="w-4 h-4 rounded"
                          />
                          <span className="text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Columns Filter */}
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3 uppercase text-sm">COLUMNS</h3>
                    <div className="space-y-2">
                      {[1, 2].map((col) => (
                        <label key={col} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={columns === col}
                            onChange={() => setColumns(col)}
                            className="w-4 h-4 rounded"
                          />
                          <span className="text-gray-700">{col} column{col > 1 ? 's' : ''}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Occupation Display */}
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3 uppercase text-sm">OCCUPATION</h3>
                    <div className="text-gray-700 font-semibold">{selectedOccupation}</div>
                    <button
                      onClick={() => {
                        setShowTemplateFilters(false);
                        setShowQuestionnaire(false);
                        setShowPathContent(true);
                        setSelectedPath("occupation");
                      }}
                      className="text-blue-600 hover:text-blue-700 font-semibold text-sm mt-2"
                    >
                      Change
                    </button>
                  </div>
                </div>

                {/* Right: Template Preview */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Best templates for {selectedOccupation}</h2>
                    <p className="text-gray-600">Industry-proven designs for your experience. Swap styles anytime.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTemplates.slice(0, 3).map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          handleStyleSelect(t.id);
                          handleFiltersComplete();
                        }}
                        className="p-6 rounded-lg border-2 border-gray-200 hover:border-yellow-400 transition bg-gray-50"
                      >
                        <div className="mb-4 bg-gray-100 h-40 rounded flex items-center justify-center text-4xl">
                          {t.preview}
                        </div>
                        <h4 className="font-bold text-gray-900">{t.name}</h4>
                        <p className="text-xs text-gray-600 mt-1">{t.description}</p>
                        <div className="mt-3 inline-block px-3 py-1 bg-yellow-400 text-gray-900 rounded text-xs font-bold">
                          RECOMMENDED
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Color palette */}
                  <div className="flex gap-2 flex-wrap">
                    {["#000000", "#4CAF50", "#8B3A3A", "#1E3A8A", "#808080", "#003366"].map((color) => (
                      <button
                        key={color}
                        className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-gray-600 transition"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Info message */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-700">
                  If you're not sure which template you want right now, you can choose one later.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (showPathContent && selectedPath === "occupation") {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12">
          <div className="max-w-4xl mx-auto px-4">
            <button
              onClick={() => setShowPathContent(false)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-8"
            >
              <ArrowLeft size={20} /> Back
            </button>

            <div className="bg-white rounded-2xl shadow-xl p-12 space-y-8">
              <div className="text-center space-y-3">
                <h2 className="text-4xl font-bold text-gray-900">Select Your Occupation</h2>
                <p className="text-gray-600 text-lg">
                  Choose your job title and we'll recommend the best templates for your field
                </p>
              </div>

              {/* Occupation Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {OCCUPATIONS.map((occ) => (
                  <button
                    key={occ}
                    onClick={() => handleOccupationSelect(occ)}
                    className={`p-4 rounded-lg border-2 font-semibold transition ${
                      selectedOccupation === occ
                        ? "border-blue-600 bg-blue-100 text-blue-900"
                        : "border-gray-200 text-gray-700 hover:border-blue-400"
                    }`}
                  >
                    {occ}
                  </button>
                ))}
              </div>

              {/* Recommended Templates */}
              {selectedOccupation && (
                <div className="space-y-4 pt-8 border-t">
                  <h3 className="font-bold text-gray-900 text-lg">
                    Templates for {selectedOccupation}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTemplates.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => handleStyleSelect(t.id)}
                        className={`p-6 rounded-xl border-2 transition ${
                          selectedStyle === t.id
                            ? "border-blue-600 bg-blue-50 shadow-lg"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <div className="text-5xl mb-3">{t.preview}</div>
                        <h4 className="font-bold text-gray-900">{t.name}</h4>
                        <p className="text-sm text-gray-600">{t.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleContinueWithPath}
                disabled={!selectedOccupation}
                className="w-full py-3 px-6 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white rounded-full font-bold text-lg transition"
              >
                Continue with {selectedOccupation && selectedOccupation + " "} Resume
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (showPathContent && selectedPath === "style") {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12">
          <div className="max-w-5xl mx-auto px-4">
            <button
              onClick={() => setShowPathContent(false)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-8"
            >
              <ArrowLeft size={20} /> Back
            </button>

            <div className="bg-white rounded-2xl shadow-xl p-12 space-y-8">
              <div className="text-center space-y-3">
                <h2 className="text-4xl font-bold text-gray-900">Choose Your Template Style</h2>
                <p className="text-gray-600 text-lg">
                  Select from our collection of professional template designs
                </p>
              </div>

              {/* Template Carousel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {TEMPLATE_DESIGNS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      handleStyleSelect(t.id);
                    }}
                    className={`p-8 rounded-2xl border-3 transition transform hover:scale-105 ${
                      selectedStyle === t.id
                        ? "border-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 shadow-xl"
                        : "border-gray-200 bg-gray-50 hover:border-blue-400 hover:shadow-lg"
                    }`}
                  >
                    <div className="text-7xl mb-4">{t.preview}</div>
                    <h4 className="font-bold text-gray-900 text-xl">{t.name}</h4>
                    <p className="text-sm text-gray-600 mt-2">{t.description}</p>
                    <div className="mt-3 text-xs btn">
                      {selectedStyle === t.id && (
                        <span className="inline-block px-3 py-1 bg-blue-600 text-white rounded-full">
                          ✓ Selected
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Preview Section */}
              <div className="mt-8 pt-8 border-t space-y-4">
                <h3 className="font-bold text-gray-900 text-lg">Selected Template Preview</h3>
                <div className="bg-gray-50 rounded-xl p-6 min-h-96">
                  <div className="relative h-full">
                    <div className={`text-6xl text-center py-16`}>
                      {TEMPLATE_DESIGNS.find((t) => t.id === selectedStyle)?.preview}
                    </div>
                    <p className="text-center text-gray-700 font-semibold">
                      {TEMPLATE_DESIGNS.find((t) => t.id === selectedStyle)?.name} Template
                    </p>
                    <p className="text-center text-gray-600 text-sm mt-2">
                      {TEMPLATE_DESIGNS.find((t) => t.id === selectedStyle)?.description}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleContinueWithPath}
                className="w-full py-3 px-6 bg-teal-600 hover:bg-teal-700 text-white rounded-full font-bold text-lg transition"
              >
                Continue with {TEMPLATE_DESIGNS.find((t) => t.id === selectedStyle)?.name} Template
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Main template selection page
    if (!showPathContent) {
      return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Go Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-12"
          >
            <ArrowLeft size={20} /> Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-5xl font-bold mb-4">
                  <span className="text-blue-900">Just three</span><br />
                  <span className="text-red-500">easy</span>
                  <span className="text-blue-900"> steps</span>
                </h1>
                <p className="text-gray-600 text-lg">Choose how you'd like to build your resume</p>
              </div>

              <div className="space-y-6">
                {/* Option 1 */}
                <button
                  onClick={() => {
                    setSelectedPath("upload");
                    setShowPathContent(true);
                  }}
                  className="w-full text-left p-6 border-2 border-blue-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition group"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-400 text-blue-900 flex items-center justify-center font-bold text-lg group-hover:bg-yellow-500 transition">
                      1
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg mb-1">
                        Choose a template based on my resume
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Upload your existing resume and we'll suggest templates that match the look and structure of your current resume.
                      </p>
                    </div>
                  </div>
                </button>

                {/* Option 2 */}
                <button
                  onClick={() => {
                    setSelectedPath("occupation");
                    setShowPathContent(true);
                  }}
                  className="w-full text-left p-6 border-2 border-blue-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition group"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-400 text-blue-900 flex items-center justify-center font-bold text-lg group-hover:bg-yellow-500 transition">
                      2
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg mb-1">
                        Choose a template based on my occupation
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Tell us your job title and we'll recommend professional designs that fit your experience and support your resume goals.
                      </p>
                    </div>
                  </div>
                </button>

                {/* Option 3 */}
                <button
                  onClick={() => {
                    setSelectedPath("style");
                    setShowPathContent(true);
                  }}
                  className="w-full text-left p-6 border-2 border-blue-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition group"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-400 text-blue-900 flex items-center justify-center font-bold text-lg group-hover:bg-yellow-500 transition">
                      3
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg mb-1">
                        Choose a template that fits my style
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Browse our collection of professional templates and choose a design that reflects your personal preferences.
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              <button
                onClick={() => {
                  if (!selectedStyle) {
                    toast.error("Please select a template design");
                    return;
                  }
                  setShowPathContent(true);
                  setSelectedPath("occupation");
                }}
                className="w-full py-4 px-6 bg-teal-600 hover:bg-teal-700 text-white rounded-full font-bold text-lg transition shadow-lg"
              >
                Next
              </button>

              <p className="text-xs text-gray-600 text-center">
                By clicking "Next" or "Just three easy steps", you agree to our{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms of Use
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>

            {/* Right Side - Template Previews */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Template Design</h2>
                <p className="text-gray-600">Browse our collection of professional resume templates</p>
              </div>

              {/* Template Grid */}
              <div className="grid grid-cols-2 gap-4">
                {TEMPLATE_DESIGNS.slice(0, 4).map((template) => (
                  <button
                    key={template.id}
                    onClick={() => {
                      setSelectedStyle(template.id);
                      setTemplate(template.id);
                      toast.success(`${template.name} template selected!`);
                    }}
                    className={`relative p-4 rounded-xl border-2 transition transform hover:scale-105 ${
                      selectedStyle === template.id
                        ? "border-teal-600 bg-teal-50 shadow-lg"
                        : "border-gray-200 bg-white hover:border-teal-400 hover:shadow-md"
                    }`}
                  >
                    {/* Template Preview */}
                    <div className="bg-gray-100 h-32 rounded-lg flex items-center justify-center mb-3">
                      <span className="text-4xl">{template.preview}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm">{template.name}</h3>
                    <p className="text-xs text-gray-600 mt-1">{template.description}</p>

                    {/* Selected Badge */}
                    {selectedStyle === template.id && (
                      <div className="absolute top-2 right-2 bg-teal-600 text-white px-2 py-1 rounded-lg text-xs font-bold">
                        ✓ Selected
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Template Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Pro Tip:</span> You can change your template design anytime during the building process.
                </p>
              </div>
            </div>
          </div>

          {/* Extra Features */}
          <div className="mt-16 pt-8 border-t border-gray-300">
            <p className="text-gray-700 font-semibold mb-4">Extra features:</p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-xl">📊</span>
                <span>Publish your online professional profile on <strong>Bold.pro</strong></span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-xl">📄</span>
                <span>Get a matching <strong>cover letter</strong></span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-xl">🔍</span>
                <span>Find your dream job with our <strong>job search tool</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    }
  }

  // Evaluative Feedback Page
  if (currentPage === "evaluative-feedback" && analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header with Illustration */}
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-12">
              <div className="flex items-center gap-8">
                <div className="text-6xl">👤</div>
                <div className="text-white">
                  <h1 className="text-4xl font-bold">You're off to a great start!</h1>
                  <p className="text-blue-100 mt-2">Here's what you got right and some areas we'll help you improve.</p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="p-12 space-y-8">
              {/* You Got It Right Section */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <span className="text-3xl">✅</span> You got it right
                </h2>
                <div className="space-y-3">
                  {analysis.strengths && analysis.strengths.length > 0 ? (
                    analysis.strengths.map((strength, idx) => (
                      <div key={idx} className="flex items-start gap-4 bg-green-50 p-4 rounded-lg border border-green-200">
                        <span className="text-2xl text-green-600 flex-shrink-0">✓</span>
                        <p className="text-gray-700 font-medium">{strength}</p>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-start gap-4 bg-green-50 p-4 rounded-lg border border-green-200">
                      <span className="text-2xl text-green-600 flex-shrink-0">✓</span>
                      <p className="text-gray-700 font-medium">You have all sections employers look for on a resume.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* How We'll Help You Improve Section */}
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <span className="text-3xl">⭐</span> How we'll help you improve:
                </h2>
                <div className="space-y-3">
                  {analysis.improvements && analysis.improvements.length > 0 ? (
                    analysis.improvements.map((improvement, idx) => (
                      <div key={idx} className="flex items-start gap-4 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <span className="text-2xl text-yellow-500 flex-shrink-0">⭐</span>
                        <div>
                          <p className="font-bold text-gray-900">{improvement.category}</p>
                          <p className="text-gray-700 text-sm mt-1">{improvement.tip}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-start gap-4 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <span className="text-2xl text-yellow-500 flex-shrink-0">⭐</span>
                        <div>
                          <p className="font-bold text-gray-900">Add Metrics and Numbers</p>
                          <p className="text-gray-700 text-sm mt-1">Enhance your Experience section with our pre-written suggestions.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <span className="text-2xl text-yellow-500 flex-shrink-0">⭐</span>
                        <div>
                          <p className="font-bold text-gray-900">Optimize Keywords</p>
                          <p className="text-gray-700 text-sm mt-1">AI-enhance your summary to give more context for this role.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <span className="text-2xl text-yellow-500 flex-shrink-0">⭐</span>
                        <div>
                          <p className="font-bold text-gray-900">Section Titles</p>
                          <p className="text-gray-700 text-sm mt-1">Make sure you're using the section titles employers expect to see.</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Keywords Section */}
              {analysis.keywordSuggestions && analysis.keywordSuggestions.length > 0 && (
                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">Keywords to Add:</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywordSuggestions.map((keyword, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Continue Button */}
              <div className="pt-8 border-t border-gray-200">
                <button
                  onClick={() => {
                    setCurrentPage("form-builder");
                    setStep(0);
                  }}
                  className="w-full py-4 px-6 bg-teal-600 hover:bg-teal-700 text-white rounded-full font-bold text-lg transition shadow-md"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show form builder page
  if (currentPage === "form-builder") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Header with info about selected path */}
          <div className="flex items-center gap-4 mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <button
              onClick={() => {
                setCurrentPage("template-selection");
                setShowTemplateSelection(true);
              }}
              className="p-2 rounded-lg hover:bg-blue-100 transition"
              title="Change template selection"
            >
              <ArrowLeft size={24} className="text-blue-600" />
            </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">Resume Builder</h1>
            <p className="text-sm text-gray-600">
              {selectedPath === "upload" && "📤 Building resume from your uploaded file"}
              {selectedPath === "occupation" && `💼 Customizing for ${selectedOccupation}`}
              {selectedPath === "style" && "🎨 Choosing template by style"}
              {selectedPath === "quick" && "⚡ Quick resume builder"}
              <span className="ml-4 text-blue-600">Step {step + 1} of {steps.length}</span>
            </p>
          </div>

          {/* Template Switcher */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-700">Template:</span>
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 bg-white hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
            >
              {TEMPLATE_DESIGNS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {autoSave && (
            <div className="ml-4 flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
              <Save size={16} /> Auto-saved
            </div>
          )}
        </div>

        {/* Step Progress Bar */}
        <div className="mb-8">
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {steps.map((s, i) => {
              const StepIcon = s.icon;
              return (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition ${
                    step === i
                      ? "bg-blue-600 text-white shadow-md"
                      : step > i
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  title={s.title}
                >
                  {step > i ? (
                    <>
                      <span>✓</span> {s.title}
                    </>
                  ) : (
                    <>
                      <StepIcon size={16} /> {s.title}
                    </>
                  )}
                </button>
              );
            })}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Content - 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Left: Form Section */}
          <div>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <CurrentIcon className="text-blue-600" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{steps[step]?.title}</h2>
                  <p className="text-xs text-gray-500">
                    Step {step + 1} of {steps.length}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-b border-gray-200 mb-6" />

              {steps[step]?.content}

              {/* Navigation */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  disabled={step === 0}
                  onClick={() => setStep(step - 1)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition font-medium text-sm flex items-center justify-center gap-2"
                >
                  <ChevronLeft size={18} /> Back
                </button>
                <button
                  disabled={step === steps.length - 1}
                  onClick={() => setStep(step + 1)}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition font-medium text-sm flex items-center justify-center gap-2"
                >
                  Next <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Live Preview */}
          <div>
            <div className="sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Preview</h3>
              <div className="max-h-[800px]">
                <LiveResumePreview
                  data={resumeData}
                  theme={theme}
                  template={template}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Resources Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-2">💡 Tips</h3>
            <p className="text-sm text-gray-700">
              Use action verbs and quantifiable achievements in your experience section.
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-2">📝 Format</h3>
            <p className="text-sm text-gray-700">
              Keep your resume to one page. Use simple fonts and clear formatting.
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-2">✨ Best Practice</h3>
            <p className="text-sm text-gray-700">
              Tailor your resume for each job. Highlight skills relevant to the role.
            </p>
          </div>
        </div>
      </div>
      </div>
    );
  }

  // Default fallback (template selection)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">Build Your Perfect Resume</h1>
          <p className="text-xl text-gray-600">Choose how you'd like to get started</p>
        </div>
        {/* Template selection content will render here */}
      </div>
    </div>
  );
};

export default ResumeBuilder;
