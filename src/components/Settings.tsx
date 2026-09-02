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
      <ThemeSelector currentTheme={currentTheme} onThemeChange={onThemeChange} />
      <GMViewSettings
        showPlayerInfoInGMView={showPlayerInfoInGMView}
        onShowPlayerInfoInGMViewChange={onShowPlayerInfoInGMViewChange}
      />
      <PopoverWidthSettings
        width={popoverWidth}
        onWidthChange={onPopoverWidthChange}
      />
    </>
  );
};

export default Settings;
