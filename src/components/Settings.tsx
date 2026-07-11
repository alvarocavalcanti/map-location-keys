import React from "react";
import ThemeSelector from "./ThemeSelector";
import { ThemeId } from "../themes";

const Settings: React.FC<{ currentTheme: ThemeId; onThemeChange: (theme: ThemeId) => void }> = ({ currentTheme, onThemeChange }) => {
  return (
    <>
      <ThemeSelector currentTheme={currentTheme} onThemeChange={onThemeChange} />
    </>
  );
};

export default Settings;
