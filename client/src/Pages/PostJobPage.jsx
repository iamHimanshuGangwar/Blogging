import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  Wand2,
  Plus,
  X,
  DollarSign,
  Loader,
  Save,
  Send,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const PostJobPage = () => {
  const navigate = useNavigate();
  const { axios } = useAppContext();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    locationType: "on-site",
    description: "",
    requirements: "",
    skills: [],
    experience: "",
    education: "",
    industry: "",
    salary: "",
    salaryMin: 0,
    salaryMax: 0,
    benefits: [],
    jobType: "Full-time",
    contactPreference: "dashboard",
    email: "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [suggestedSkills, setSuggestedSkills] = useState([]);
  const [benefitInput, setBenefitInput] = useState("");

  const steps = [
    { num: 1, label: "Role Details" },
    { num: 2, label: "Requirements" },
    { num: 3, label: "Perks & Salary" },
    { num: 4, label: "Publish" },
  ];

  const generateJobDescription = async () => {
    if (!formData.title) {
      toast.error("Please enter a job title first");
      return;
    }

    setAiGenerating(true);
    try {
      const descriptions = {
        developer:
          "We are looking for a talented developer to join our growing engineering team. You will work on challenging problems, collaborate with experienced engineers, and have the opportunity to grow your skills.",
        designer:
          "Seeking a creative designer to create stunning visual experiences. You will collaborate with product and engineering teams to design beautiful, intuitive interfaces.",
        manager:
          "Join our team as a manager and lead a talented group of professionals. You will be responsible for team growth, project delivery, and cultivating a positive work culture.",
        default:
          "We are hiring for this exciting position. If you meet the requirements and are interested in joining our team, we would love to hear from you.",
      };

      const key = formData.title.toLowerCase().split(" ")[0];
      const suggestion = descriptions[key] || descriptions.default;

      setFormData((prev) => ({ ...prev, description: suggestion }));
      toast.success("✨ AI generated description!");
      setShowAISuggestions(false);
    } catch (error) {
      toast.error("Failed to generate description");
    } finally {
      setAiGenerating(false);
    }
  };

  const getSkillSuggestions = (input) => {
    const allSkills = [
      "React",
      "Node.js",
      "Python",
      "JavaScript",
      "TypeScript",
      "Vue.js",
      "Angular",
      "Next.js",
      "Express.js",
      "MongoDB",
      "PostgreSQL",
      "AWS",
      "Docker",
      "Kubernetes",
      "Git",
    ];
    if (!input) return [];
    return allSkills.filter(
      (skill) =>
        skill.toLowerCase().includes(input.toLowerCase()) &&
        !formData.skills.includes(skill)
    );
  };

  const addSkill = (skill) => {
    if (!formData.skills.includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
    }
    setSkillInput("");
    setSuggestedSkills([]);
  };

  const removeSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const addBenefit = () => {
    if (benefitInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        benefits: [...prev.benefits, benefitInput],
      }));
      setBenefitInput("");
    }
  };

  const removeBenefit = (index) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSalaryChange = (field, value) => {
    if (field === "min") {
      setFormData((prev) => ({ ...prev, salaryMin: value }));
    } else if (field === "max") {
      setFormData((prev) => ({ ...prev, salaryMax: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      return;
    }

    if (!formData.title || !formData.company || !formData.location || !formData.industry) {
      toast.error("Please fill in all required fields including industry");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/job-listings/create", {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        description: formData.description,
        requirements: formData.requirements || "",
        benefits: Array.isArray(formData.benefits) ? formData.benefits.join(", ") : formData.benefits || "",
        industry: formData.industry,
        salary: formData.salaryMin && formData.salaryMax 
          ? `${formData.salaryMin} - ${formData.salaryMax}`
          : "",
        jobType: formData.jobType,
      });

      if (response.data.success) {
        toast.success("🎉 Job posted successfully!");
        navigate("/jobs");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Senior React Developer"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Your company name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="City, Country"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Industry *
              </label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Industry</option>
                <option value="Technology">Technology</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Retail">Retail</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Education">Education</option>
                <option value="Hospitality">Hospitality</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                  Job Description
                </label>
                <button
                  type="button"
                  onClick={() => setShowAISuggestions(!showAISuggestions)}
                  className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                >
                  <Wand2 size={16} />
                  {aiGenerating ? "Generating..." : "AI Assistant"}
                </button>
              </div>

              {showAISuggestions && (
                <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <button
                    type="button"
                    onClick={generateJobDescription}
                    disabled={aiGenerating}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
                  >
                    {aiGenerating ? (
                      <>
                        <Loader size={16} className="animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 size={16} />
                        Generate Description from Title
                      </>
                    )}
                  </button>
                </div>
              )}

              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Write a compelling job description..."
                rows="6"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Years of Experience Required
              </label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                placeholder="e.g., 3-5 years"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Required Education
              </label>
              <select
                name="education"
                value={formData.education}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select education level</option>
                <option value="High School">High School</option>
                <option value="Bachelor's">Bachelor's Degree</option>
                <option value="Master's">Master's Degree</option>
                <option value="PhD">PhD</option>
                <option value="Any">Any</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Required Skills
              </label>
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => {
                      setSkillInput(e.target.value);
                      setSuggestedSkills(getSkillSuggestions(e.target.value));
                    }}
                    placeholder="Type a skill and select from suggestions"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {suggestedSkills.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
                      {suggestedSkills.slice(0, 5).map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => addSkill(skill)}
                          className="w-full text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-900 dark:text-white font-medium border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                        >
                          + {skill}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill) => (
                    <div
                      key={skill}
                      className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:text-blue-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Job Type
              </label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                <DollarSign size={20} />
                Salary Range
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Minimum Salary
                  </label>
                  <input
                    type="number"
                    value={formData.salaryMin}
                    onChange={(e) =>
                      handleSalaryChange("min", parseFloat(e.target.value) || 0)
                    }
                    placeholder="50000"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Maximum Salary
                  </label>
                  <input
                    type="number"
                    value={formData.salaryMax}
                    onChange={(e) =>
                      handleSalaryChange("max", parseFloat(e.target.value) || 0)
                    }
                    placeholder="150000"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {formData.salaryMin > 0 && formData.salaryMax > 0 && (
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                  Salary Range: ${formData.salaryMin.toLocaleString()} - $
                  {formData.salaryMax.toLocaleString()}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Benefits & Perks
              </label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={benefitInput}
                    onChange={(e) => setBenefitInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addBenefit();
                      }
                    }}
                    placeholder="e.g., Health Insurance, Remote Work"
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addBenefit}
                    className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    <Plus size={18} />
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium"
                    >
                      {benefit}
                      <button
                        type="button"
                        onClick={() => removeBenefit(index)}
                        className="hover:text-green-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                How should we send resumes?
              </h3>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg border-2 border-blue-300 dark:border-blue-700 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition">
                  <input
                    type="radio"
                    name="contactPreference"
                    value="dashboard"
                    checked={formData.contactPreference === "dashboard"}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      📊 Via Dashboard
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receive resumes directly in your job portal dashboard
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <input
                    type="radio"
                    name="contactPreference"
                    value="email"
                    checked={formData.contactPreference === "email"}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      📧 Via Email
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Get formatted emails with PDF resumes attached
                    </p>
                  </div>
                </label>
              </div>

              {formData.contactPreference === "email" && (
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-indigo-200 dark:border-indigo-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                ✅ Job Summary
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Position:
                  </span>{" "}
                  {formData.title || "Not specified"}
                </p>
                <p>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Company:
                  </span>{" "}
                  {formData.company || "Not specified"}
                </p>
                <p>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Location:
                  </span>{" "}
                  {formData.location || "Not specified"}
                </p>
                <p>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Industry:
                  </span>{" "}
                  {formData.industry || "Not specified"}
                </p>
                <p>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Salary:
                  </span>{" "}
                  {formData.salaryMin && formData.salaryMax
                    ? `$${formData.salaryMin.toLocaleString()} - $${formData.salaryMax.toLocaleString()}`
                    : "Not specified"}
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="min-h-screen transition-all duration-500"
      style={{
        background:
          currentStep >= 2
            ? "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)"
            : "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      <div className="max-w-3xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate("/jobs")}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 font-medium"
        >
          <ArrowLeft size={20} />
          Back to Jobs
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-12">
        <div className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
          <div className="px-8 py-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              {steps.map((step, idx) => (
                <div key={step.num} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition ${
                        step.num <= currentStep
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {step.num}
                    </div>
                    <p
                      className={`text-xs font-semibold mt-2 text-center ${
                        step.num <= currentStep
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>

                  {idx < steps.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-2 rounded-full transition ${
                        step.num < currentStep
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600"
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {steps[currentStep - 1].label}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Step {currentStep} of {steps.length}
            </p>

            {renderStepContent()}

            <div className="flex gap-4 mt-10">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold transition"
                >
                  ← Previous
                </button>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition ${
                  currentStep === 4
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg hover:shadow-green-500/50"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/50"
                }`}
              >
                {currentStep === 4 ? (
                  <>
                    {loading ? (
                      <Loader size={18} className="animate-spin" />
                    ) : (
                      <Send size={18} />
                    )}
                    {loading ? "Publishing..." : "Publish Job"}
                  </>
                ) : (
                  <>
                    {currentStep < 4 && <ChevronRight size={18} />}
                    {currentStep < 4 ? "Next" : "Complete"}
                  </>
                )}
              </button>
            </div>

            {currentStep === 1 && (
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      title: "",
                      company: "",
                      location: "",
                      description: "",
                    })
                  }
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium text-sm"
                >
                  <Save size={16} />
                  Save as Draft
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJobPage;
