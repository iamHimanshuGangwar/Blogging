import React, { useState, useEffect } from "react";
import { Zap, Save, RotateCcw, Plus } from "lucide-react";
import toast from "react-hot-toast";

/**
 * Smart Filter Presets & Saved Searches
 * Allows users to save and quickly apply filter combinations
 */
const FilterPresetsPanel = ({
  currentFilters,
  onApplyPreset,
  onSavePreset,
  presets = []
}) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [presetName, setPresetName] = useState("");
  const [savedPresets, setSavedPresets] = useState(presets);

  // Load saved presets from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("jobFilterPresets");
    if (stored) {
      try {
        setSavedPresets(JSON.parse(stored));
      } catch (e) {
        console.error("Error loading presets:", e);
      }
    }
  }, []);

  // Default presets
  const defaultPresets = [
    {
      id: "remote-only",
      name: "Remote Only",
      filters: { jobType: "Remote", locationFilter: "" },
      icon: "🌍",
    },
    {
      id: "entry-level",
      name: "Entry Level",
      filters: { searchQuery: "junior", industryFilter: "All" },
      icon: "🚀",
    },
    {
      id: "senior-tech",
      name: "Senior Tech",
      filters: { searchQuery: "senior", industryFilter: "Technology" },
      icon: "⭐",
    },
    {
      id: "startup",
      name: "Startup Vibes",
      filters: { industryFilter: "Startup", locationFilter: "" },
      icon: "🎯",
    },
    {
      id: "high-pay",
      name: "High Salary",
      filters: { searchQuery: "senior OR lead", industryFilter: "Technology" },
      icon: "💰",
    },
  ];

  const handleSavePreset = () => {
    if (!presetName.trim()) {
      toast.error("Please enter a preset name");
      return;
    }

    const newPreset = {
      id: `custom-${Date.now()}`,
      name: presetName,
      filters: currentFilters,
      icon: "📌",
      custom: true,
    };

    const updated = [...savedPresets, newPreset];
    setSavedPresets(updated);
    localStorage.setItem("jobFilterPresets", JSON.stringify(updated));

    toast.success(`Preset "${presetName}" saved! ✨`);
    setPresetName("");
    setShowSaveDialog(false);

    if (onSavePreset) onSavePreset(newPreset);
  };

  const handleDeletePreset = (id) => {
    const updated = savedPresets.filter((p) => p.id !== id);
    setSavedPresets(updated);
    localStorage.setItem("jobFilterPresets", JSON.stringify(updated));
    toast.success("Preset deleted");
  };

  const handleResetFilters = () => {
    if (onApplyPreset) {
      onApplyPreset({
        searchQuery: "",
        locationFilter: "",
        industryFilter: "All",
      });
    }
    toast.success("Filters reset");
  };

  return (
    <div className="space-y-4">
      {/* Save Current as Preset */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowSaveDialog(!showSaveDialog)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
        >
          <Save size={18} />
          Save as Preset
        </button>
        <button
          onClick={handleResetFilters}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          title="Reset all filters"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-800 space-y-3">
          <input
            type="text"
            placeholder="e.g., Remote Senior React Jobs"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            onKeyPress={(e) => e.key === "Enter" && handleSavePreset()}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSavePreset}
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Save
            </button>
            <button
              onClick={() => setShowSaveDialog(false)}
              className="flex-1 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Presets Grid */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
          Quick Presets
        </p>
        <div className="grid grid-cols-2 gap-2">
          {defaultPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onApplyPreset(preset.filters)}
              className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md transition"
              title={`Apply: ${preset.name}`}
            >
              <div className="text-lg mb-1">{preset.icon}</div>
              <div className="text-xs font-semibold text-gray-900 dark:text-white text-left">
                {preset.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Presets */}
      {savedPresets.length > 0 && (
        <div className="space-y-2 mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
            My Saved Searches
          </p>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {savedPresets.map((preset) => (
              <div
                key={preset.id}
                className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
              >
                <button
                  onClick={() => onApplyPreset(preset.filters)}
                  className="flex-1 text-left hover:opacity-70 transition"
                >
                  <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <span>{preset.icon}</span>
                    {preset.name}
                  </p>
                </button>
                {preset.custom && (
                  <button
                    onClick={() => handleDeletePreset(preset.id)}
                    className="text-xs text-red-500 hover:text-red-700 font-semibold"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Smart Recommendation */}
      <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800 mt-4">
        <div className="flex gap-2 items-start">
          <Zap size={18} className="text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-purple-900 dark:text-purple-300 mb-1">
              💡 Smart Tip
            </p>
            <p className="text-xs text-gray-700 dark:text-gray-300">
              Create presets for your common searches. They sync across devices!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPresetsPanel;
