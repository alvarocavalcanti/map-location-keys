import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { Nav, Tab } from "react-bootstrap";

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

export default function SPA() {
  const [locationKeyToEdit, setLocationKeyToEdit] = React.useState(
    {} as LocationKeyType
  );
  const [locationKeys, setLocationKeys] = React.useState<LocationKey[]>([]);
  const [fogKeys, setFogKeys] = React.useState<FogKey[]>([]);
  const [role, setRole] = React.useState<"GM" | "PLAYER">("GM");
  const [activeTab, setActiveTab] = useState<string>("location-keys");
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
    document.getElementById("html_root")?.setAttribute("data-bs-theme", theme);
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
    <div className="p-2">
      {isDevMode() ? (
        <div className="alert alert-warning p-2 mb-3">Development Mode</div>
      ) : null}
      <h1 className="mb-3">Map Location Keys</h1>

      <Tab.Container activeKey={activeTab} onSelect={handleTabSelect}>
        <Nav variant="tabs" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="location-keys">Location Keys</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="tools">Tools</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="help">Help</Nav.Link>
          </Nav.Item>
          <div className="ms-auto text-secondary small align-self-center">v{version}</div>
        </Nav>
      </Tab.Container>

      {activeTab === "tools" && (
        <Nav variant="pills" className="mb-3" activeKey={location.pathname}>
          <Nav.Item>
            <Nav.Link eventKey={paths.importExport} onClick={() => navigate(paths.importExport)}>
              Location Keys
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={paths.fogExportImport} onClick={() => navigate(paths.fogExportImport)}>
              Fog
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={paths.bulkActions} onClick={() => navigate(paths.bulkActions)}>
              Bulk Actions
            </Nav.Link>
          </Nav.Item>
        </Nav>
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
        <Route path={paths.help} element={<Help version={version} />} />
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
