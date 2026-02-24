import React, { useState } from "react";
import { Send } from "lucide-react";
import toast from "react-hot-toast";

const QuickApplyFAB = ({ 
  isVisible = false, 
  selectedJob = null, 
  userResume = null,
  onApply = null,
  isInProfessionalSection = false 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuickApply = async () => {
    if (!selectedJob) {
      toast.error("Please select a job first");
      return;
    }

    if (!userResume) {
      toast.error("No resume in standby. Please upload a resume.");
      return;
    }

    if (onApply) {
      setIsSubmitting(true);
      try {
        await onApply(selectedJob, userResume);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!isInProfessionalSection) return null;

  return (
    <button
      onClick={handleQuickApply}
      disabled={isSubmitting || !selectedJob}
      className={`fab-quick-apply ${isVisible ? "visible" : ""} ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
      title={selectedJob ? "Quick Apply with Standby Resume" : "Select a job to quick apply"}
    >
      {isSubmitting ? (
        <span className="animate-spin">⟳</span>
      ) : (
        <Send size={28} />
      )}
    </button>
  );
};

export default QuickApplyFAB;
