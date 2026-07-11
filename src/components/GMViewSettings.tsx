import React from "react";

interface GMViewSettingsProps {
  showPlayerInfoInGMView: boolean;
  onShowPlayerInfoInGMViewChange: (enabled: boolean) => void;
}

const GMViewSettings: React.FC<GMViewSettingsProps> = ({
  showPlayerInfoInGMView,
  onShowPlayerInfoInGMViewChange,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-4 mb-3">
      <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
        GM View
      </h2>
      <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm">
        Control which player-facing details are also shown in the GM list:
      </p>
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={showPlayerInfoInGMView}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            onShowPlayerInfoInGMViewChange(event.target.checked)
          }
          className="mt-1"
        />
        <span>
          <span className="block text-gray-900 dark:text-white font-medium">
            Show Player Information in GM view
          </span>
          <span className="block text-sm text-gray-700 dark:text-gray-300">
            Display each location key&apos;s Player Information beneath the
            primary details in the GM list.
          </span>
        </span>
      </label>
    </div>
  );
};

export default GMViewSettings;
