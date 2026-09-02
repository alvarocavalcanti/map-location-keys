import React from "react";

const WIDTH_PRESETS = [450, 500, 600, 800];

interface PopoverWidthSettingsProps {
  width: number;
  onWidthChange: (width: number) => void;
}

const PopoverWidthSettings: React.FC<PopoverWidthSettingsProps> = ({
  width,
  onWidthChange,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-4 mb-3">
      <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
        Popover Width
      </h2>
      <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm">
        Choose how wide the extension popover is. A narrower popover leaves more
        of the battlemap visible. The new width applies immediately and is
        remembered for this browser.
      </p>
      <div className="flex gap-2 flex-wrap">
        {WIDTH_PRESETS.map((preset) => (
          <button
            key={preset}
            onClick={() => onWidthChange(preset)}
            className={`px-4 py-2 rounded font-medium text-sm border-2 transition-colors ${
              width === preset
                ? "bg-blue-600 border-blue-600 text-white"
                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
            }`}
          >
            {preset}px
          </button>
        ))}
      </div>
    </div>
  );
};

export default PopoverWidthSettings;
