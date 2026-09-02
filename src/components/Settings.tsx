import React from "react";
import ThemeSelector from "./ThemeSelector";
import GMViewSettings from "./GMViewSettings";
import PopoverWidthSettings from "./PopoverWidthSettings";
import { ThemeId } from "../themes";

const Settings: React.FC<{
  currentTheme: ThemeId;
  onThemeChange: React.Dispatch<ThemeId>;
  showPlayerInfoInGMView: boolean;
  onShowPlayerInfoInGMViewChange: React.Dispatch<boolean>;
  popoverWidth: number;
  onPopoverWidthChange: React.Dispatch<number>;
}> = ({
  currentTheme,
  onThemeChange,
  showPlayerInfoInGMView,
  onShowPlayerInfoInGMViewChange,
  popoverWidth,
  onPopoverWidthChange,
}) => {
  return (
    <>
      <PopoverWidthSettings
        width={popoverWidth}
        onWidthChange={onPopoverWidthChange}
      />
      <GMViewSettings
        showPlayerInfoInGMView={showPlayerInfoInGMView}
        onShowPlayerInfoInGMViewChange={onShowPlayerInfoInGMViewChange}
      />
      <ThemeSelector currentTheme={currentTheme} onThemeChange={onThemeChange} />
    </>
  );
};

export default Settings;
