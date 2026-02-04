import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate, useLocation } from "react-router-dom";

import LocationKey from "./LocationKey";
import LocationKeys from "./LocationKeys";

import type { LocationKey as LocationKeyType, FogKey } from "../@types/types";
import {
  getItemText,
  loadExistingLocationKeys,
  loadExistingFogKeys,
  sortLocationKeys,
  sortFogKeys,
  isDevMode,
} from "../utils";
import OBR, { Item, Player } from "@owlbear-rodeo/sdk";
import { setupContextMenu } from "../contextMenu";
import Help from "./Help";
import ImportExport from "./ImportExport";
import FogExportImport from "./FogExportImport";
import { paths } from "./util/constants";
import PlayerView from "./PlayerView";
import AddDeleteAll from "./AddDeleteAll";
import { useTheme } from "../hooks/useTheme";
import { ColorMode } from "../themes";
import WhatsNew from "./WhatsNew";

export default function SPA() {
  const [locationKeyToEdit, setLocationKeyToEdit] = React.useState(
    {} as LocationKeyType
  );
  const [locationKeys, setLocationKeys] = React.useState<LocationKey[]>([]);
  const [fogKeys, setFogKeys] = React.useState<FogKey[]>([]);
  const [role, setRole] = React.useState<"GM" | "PLAYER">("GM");
  const [activeTab, setActiveTab] = useState<string>("location-keys");
  const [colorMode, setColorMode] = useState<ColorMode>('dark');
  const { themeId, changeTheme } = useTheme(colorMode);
  const navigate = useNavigate();
  const location = useLocation();

  const loadLocationKeys = (items: Item[]): void => {
    const newLocationKeys: LocationKey[] = [];

    loadExistingLocationKeys(items, newLocationKeys, getItemText);

    sortLocationKeys(newLocationKeys);

    setLocationKeys(newLocationKeys);
  };

  const loadFogKeys = (items: Item[]): void => {
    const newFogKeys: FogKey[] = [];

    loadExistingFogKeys(items, newFogKeys);

    sortFogKeys(newFogKeys);

    setFogKeys(newFogKeys);
  };

  const setTheme = (theme: string): void => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      setColorMode('dark');
    } else {
      root.classList.remove('dark');
      setColorMode('light');
    }
  };

  const handlePlayerChange = (player: Player) => {
    setRole(player.role);
  };

  const [version, setVersion] = useState("unknown");
  useEffect(() => {
    fetch("/manifest.json")
      .then((b) => b.json())
      .then((j) => j.version)
      .then(setVersion);
  }, []);

  useEffect(() => {
    OBR.onReady(() => {
      setupContextMenu();
      OBR.scene.items
        .getItems((item) => {
          return item.layer === "TEXT" || item.layer === "PROP";
        })
        .then((items) => loadLocationKeys(items));
      OBR.scene.items
        .getItems((item) => {
          return item.layer === "FOG";
        })
        .then((items) => loadFogKeys(items));
      OBR.scene.items.onChange((items) => {
        loadLocationKeys(items.filter((item) => item.layer === "TEXT" || item.layer === "PROP"));
        loadFogKeys(items.filter((item) => item.layer === "FOG"));
      });
      OBR.theme.getTheme().then((theme) => {
        setTheme(theme.mode.toLowerCase());
      });
      OBR.theme.onChange((theme) => {
        setTheme(theme.mode.toLowerCase());
      });
      OBR.player.onChange(handlePlayerChange);
      OBR.player.getRole().then(setRole);
    });
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith(paths.locationKey)) {
      setActiveTab("location-keys");
    } else if (location.pathname === paths.importExport || location.pathname === paths.bulkActions || location.pathname === paths.fogExportImport) {
      setActiveTab("tools");
    } else if (location.pathname === paths.help) {
      setActiveTab("help");
    } else if (location.pathname === "/") {
      setActiveTab("location-keys");
    }
  }, [location.pathname]);

  const handleTabSelect = (key: string | null) => {
    if (key) {
      setActiveTab(key);
      if (key === "location-keys") {
        navigate("/");
      } else if (key === "tools") {
        navigate(paths.importExport);
      } else if (key === "help") {
        navigate(paths.help);
      }
    }
  };

  return role === "GM" ? (
    <div className="p-4">
      <WhatsNew currentVersion={version} storageKey="map-location-keys-last-seen-version" />

      {isDevMode() ? (
        <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-700 p-2 mb-3 text-yellow-800 dark:text-yellow-200 rounded">
          Development Mode
        </div>
      ) : null}
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Map Location Keys</h1>

      {/* Main Tabs */}
      <div className="mb-4">
        <div className="flex border-b border-gray-300 dark:border-gray-600">
          <button
            onClick={() => handleTabSelect("location-keys")}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "location-keys"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-300"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            Location Keys
          </button>
          <button
            onClick={() => handleTabSelect("tools")}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "tools"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-300"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            Tools
          </button>
          <button
            onClick={() => handleTabSelect("help")}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "help"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-300"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            Help
          </button>
          <div className="ml-auto self-center text-gray-500 dark:text-gray-400 text-xs">
            v{version}
          </div>
        </div>
      </div>

      {/* Sub-navigation for Tools */}
      {activeTab === "tools" && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => navigate(paths.importExport)}
            className={`px-4 py-2 rounded font-medium text-sm border-2 transition-colors ${
              location.pathname === paths.importExport
                ? "bg-blue-600 border-blue-600 text-white"
                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
            }`}
          >
            Location Keys
          </button>
          <button
            onClick={() => navigate(paths.fogExportImport)}
            className={`px-4 py-2 rounded font-medium text-sm border-2 transition-colors ${
              location.pathname === paths.fogExportImport
                ? "bg-blue-600 border-blue-600 text-white"
                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
            }`}
          >
            Fog
          </button>
          <button
            onClick={() => navigate(paths.bulkActions)}
            className={`px-4 py-2 rounded font-medium text-sm border-2 transition-colors ${
              location.pathname === paths.bulkActions
                ? "bg-blue-600 border-blue-600 text-white"
                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
            }`}
          >
            Bulk Actions
          </button>
        </div>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <LocationKeys
              setLocationKeyToEdit={setLocationKeyToEdit}
              locationKeys={locationKeys}
            />
          }
        />
        <Route
          path={paths.locationKey}
          element={
            <LocationKey
              locationKey={locationKeyToEdit}
              setSelectedLocationKey={setLocationKeyToEdit}
            />
          }
        />
        <Route
          path={paths.importExport}
          element={<ImportExport locationKeys={locationKeys} />}
        />
        <Route
          path={paths.fogExportImport}
          element={<FogExportImport fogKeys={fogKeys} />}
        />
        <Route
          path={paths.bulkActions}
          element={<AddDeleteAll />}
        />
        <Route path={paths.help} element={<Help version={version} currentTheme={themeId} onThemeChange={changeTheme} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  ) : (
    <Routes>
      <Route path="/" element={<Navigate to={paths.playerView} />} />
      <Route path={paths.playerView} element={<PlayerView />} />
    </Routes>
  );
}
