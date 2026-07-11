import React from "react";
import ThemeSelector from "./ThemeSelector";
import GMViewSettings from "./GMViewSettings";
import { ThemeId } from "../themes";

const Settings: React.FC<{
  currentTheme: ThemeId;
  onThemeChange: React.Dispatch<ThemeId>;
  showPlayerInfoInGMView: boolean;
  onShowPlayerInfoInGMViewChange: React.Dispatch<boolean>;
}> = ({
  currentTheme,
  onThemeChange,
  showPlayerInfoInGMView,
  onShowPlayerInfoInGMViewChange,
}) => {
  return (
    <>
      <ThemeSelector currentTheme={currentTheme} onThemeChange={onThemeChange} />
      <GMViewSettings
        showPlayerInfoInGMView={showPlayerInfoInGMView}
        onShowPlayerInfoInGMViewChange={onShowPlayerInfoInGMViewChange}
      />
    </>
  );
};

export default Settings;
