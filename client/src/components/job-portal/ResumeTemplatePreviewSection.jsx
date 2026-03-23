import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Resume Template Preview Component
 * Shows all 5 resume templates as live previews
 * User can select their preferred template
 */

const TEMPLATES = [
  {
    id: "professional",
    name: "Professional",
    description: "Clean and Corporate",
    color: "bg-blue-50 border-blue-200",
    accent: "text-blue-700",
    preview: ({ data }) => (
      <div className="bg-white p-6 text-gray-900 text-xs">
        <div className="border-b-2 border-blue-700 pb-3 mb-3">
          <h1 className="text-lg font-bold">{data.personal.fullName || "ALAN NELSON"}</h1>
          <p className="text-blue-700 font-semibold">{data.personal.professionalTitle || "Certified Nursing Assistant"}</p>
          <p className="text-gray-600 text-xs mt-1">
            {data.personal.email || "alan@example.com"} • {data.personal.phone || "(555) 555-5555"}
          </p>
        </div>

        <div className="mb-3">
          <h3 className="font-bold text-blue-700 border-b border-blue-700 pb-1 mb-2">WORK HISTORY</h3>
          <div className="space-y-2">
            <div>
              <p className="font-bold">{data.experience?.[0]?.jobTitle || "Certified Nursing Assistant"}</p>
              <p className="text-blue-700 font-semibold">{data.experience?.[0]?.company || "Kanzada, OK"}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-blue-700 border-b border-blue-700 pb-1 mb-2">SKILLS</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <span>• {data.skills?.[0] || "Feeding assistance"}</span>
            <span>• {data.skills?.[1] || "Wound care"}</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "modern",
    name: "Modern",
    description: "Contemporary with Sidebar",
    color: "bg-cyan-50 border-cyan-200",
    accent: "text-cyan-700",
    preview: ({ data }) => (
      <div className="bg-white p-4 text-xs flex h-full">
        <div className="bg-cyan-100 w-1/3 p-3 pr-4">
          <h1 className="font-bold text-sm mb-3">{(data.personal.fullName || "JUSTIN DAVIS").toUpperCase()}</h1>
          <div className="space-y-3">
            <div>
              <p className="font-bold text-cyan-700 text-xs">CONTACT</p>
              <p className="text-gray-700 text-xs mt-1">{data.personal.email || "email@example.com"}</p>
              <p className="text-gray-700 text-xs">{data.personal.phone || "555-555-5555"}</p>
            </div>
            <div>
              <p className="font-bold text-cyan-700 text-xs">SKILLS</p>
              <p className="text-gray-700 text-xs mt-1">{data.skills?.join(", ") || "Customer Service, Sales"}</p>
            </div>
          </div>
        </div>
        <div className="w-2/3 p-3 pl-4">
          <p className="font-bold text-cyan-700 mb-2">PROFESSIONAL SUMMARY</p>
          <p className="text-gray-700 text-xs leading-tight mb-2">{data.summary || "Professional summary will appear here"}</p>
          <p className="font-bold text-cyan-700 mb-1">WORK HISTORY</p>
          <p className="text-gray-600 text-xs">{data.experience?.[0]?.jobTitle || "Job Title"}</p>
        </div>
      </div>
    ),
  },
  {
    id: "creative",
    name: "Creative",
    description: "Bold and Artistic",
    color: "bg-purple-50 border-purple-200",
    accent: "text-purple-700",
    preview: ({ data }) => (
      <div className="bg-white p-6 text-gray-900 text-xs">
        <div className="bg-black text-white p-3 mb-3">
          <h1 className="text-base font-bold">{data.personal.fullName || "KATHERINE TURNER"}</h1>
          <p className="text-sm">{data.personal.professionalTitle || "Professional Title"}</p>
        </div>

        <div className="mb-3">
          <h3 className="font-bold text-purple-700 mb-2">PROFESSIONAL SUMMARY</h3>
          <p className="text-gray-700 text-xs leading-tight">{data.summary || "Summary text here"}</p>
        </div>

        <div>
          <h3 className="font-bold text-purple-700 mb-2">SKILLS</h3>
          <div className="flex flex-wrap gap-1">
            {data.skills?.slice(0, 3).map((skill, i) => (
              <span key={i} className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                {skill}
              </span>
            )) || <span className="text-gray-600">Skills</span>}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple and Elegant",
    color: "bg-gray-50 border-gray-200",
    accent: "text-gray-700",
    preview: ({ data }) => (
      <div className="bg-white p-6 text-gray-900 text-xs">
        <div className="mb-3 pb-3 border-b-2 border-gray-400">
          <h1 className="text-lg font-bold">{data.personal.fullName || "CRAIG WALKER"}</h1>
          <p className="text-gray-600">{data.personal.professionalTitle || "Professional Title"}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <h3 className="font-bold mb-2">EXPERIENCE</h3>
            <p className="text-gray-700">{data.experience?.[0]?.jobTitle || "Job Title"}</p>
          </div>
          <div>
            <h3 className="font-bold mb-2">SKILLS</h3>
            <p className="text-gray-700">{data.skills?.slice(0, 2).join(", ") || "Skills"}</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Premium Design",
    color: "bg-amber-50 border-amber-200",
    accent: "text-amber-700",
    preview: ({ data }) => (
      <div className="bg-white p-6 text-gray-900 text-xs">
        <div className="bg-amber-100 p-3 mb-3 -mx-6 -mt-6 px-6 pt-6">
          <h1 className="text-lg font-bold text-gray-900">{data.personal.fullName || "ELVIRA LITTLE"}</h1>
          <p className="text-amber-700 font-semibold text-xs">{data.personal.professionalTitle || "Professional"}</p>
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="font-bold text-amber-700 text-xs mb-1">PROFESSIONAL SUMMARY</h3>
            <p className="text-gray-700 leading-tight">{data.summary?.substring(0, 100) || "Professional summary will appear here"}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <h4 className="font-bold text-xs mb-1">EXPERIENCE</h4>
              <p className="text-gray-700 text-xs">{data.experience?.[0]?.company || "Company"}</p>
            </div>
            <div>
              <h4 className="font-bold text-xs mb-1">SKILLS</h4>
              <p className="text-gray-700 text-xs">{data.skills?.slice(0, 2).join(", ") || "Skills"}</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

const ResumeTemplatePreviewSection = ({ resumeData, selectedTemplate, onTemplateSelect }) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  const scroll = (direction) => {
    const container = document.getElementById("template-scroll-container");
    if (container) {
      const scrollAmount = 320;
      if (direction === "left") {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        setScrollPosition(Math.max(0, scrollPosition - scrollAmount));
      } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
        setScrollPosition(scrollPosition + scrollAmount);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-8 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Choose Your Resume Format
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Select a template style that best represents your professional profile
        </p>
      </div>

      {/* Templates Carousel */}
      <div className="relative">
        {/* Left Scroll Button */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"
        >
          <ChevronLeft size={20} className="text-gray-900 dark:text-white" />
        </button>

        {/* Templates Container */}
        <div
          id="template-scroll-container"
          className="flex gap-4 overflow-x-auto scroll-smooth pb-2 px-12"
          style={{ scrollBehavior: "smooth" }}
        >
          {TEMPLATES.map((template) => (
            <div
              key={template.id}
              onClick={() => onTemplateSelect(template.id)}
              className={`flex-shrink-0 w-80 cursor-pointer transition-all transform hover:scale-105 ${
                selectedTemplate === template.id ? "ring-4 ring-blue-500 scale-105" : ""
              }`}
            >
              {/* Template Card */}
              <div
                className={`${template.color} border-2 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition`}
              >
                {/* Preview Window */}
                <div className="bg-blue-100 p-1 h-1 w-full"></div>
                <div className="h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                  {template.preview({ data: resumeData })}
                </div>

                {/* Template Info */}
                <div className="p-4 bg-white dark:bg-gray-800">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{template.description}</p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTemplateSelect(template.id);
                    }}
                    className={`w-full py-2 rounded font-medium text-sm transition ${
                      selectedTemplate === template.id
                        ? "bg-blue-600 text-white"
                        : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50"
                    }`}
                  >
                    {selectedTemplate === template.id ? "✓ Selected" : "Select"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"
        >
          <ChevronRight size={20} className="text-gray-900 dark:text-white" />
        </button>
      </div>

      {/* Selected Template Info */}
      {selectedTemplate && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold">Current Template:</span>{" "}
            {TEMPLATES.find((t) => t.id === selectedTemplate)?.name}
          </p>
        </div>
      )}
    </div>
  );
};

export default ResumeTemplatePreviewSection;
