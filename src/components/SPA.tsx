import React, { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";

import LocationKey from "./LocationKey";
import LocationKeys from "./LocationKeys";

import type { LocationKey as LocationKeyType } from "../@types/types";
import {
  getItemText,
  loadExistingLocationKeys,
  sortLocationKeys,
} from "../utils";
import OBR, { Item, Player } from "@owlbear-rodeo/sdk";
import { setupContextMenu } from "../contextMenu";
import Help from "./Help";
import Navbar from "./Navbar";
import ImportExport from "./ImportExport";
import { paths } from "./util/constants";
import PlayerView from "./PlayerView";
import AddDeleteAll from "./AddDeleteAll";

export default function SPA() {
  const [locationKeyToEdit, setLocationKeyToEdit] = React.useState(
    {} as LocationKeyType
  );
  const [locationKeys, setLocationKeys] = React.useState<LocationKey[]>([]);
  const [role, setRole] = React.useState<"GM" | "PLAYER">("GM");

  const loadLocationKeys = (items: Item[]): void => {
    const newLocationKeys: LocationKey[] = [];

    loadExistingLocationKeys(items, newLocationKeys, getItemText);

    sortLocationKeys(newLocationKeys);

    setLocationKeys(newLocationKeys);
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
      OBR.scene.items.onChange((items) => {
        loadLocationKeys(items.filter((item) => item.layer === "TEXT" || item.layer === "PROP"));
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

  return role === "GM" ? (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
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
        <Route path={paths.bulkActions} element={<AddDeleteAll />} />
        <Route path={paths.help} element={<Help version={version} />} />
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  ) : (
    <Routes>
      <Route path="/" element={<Navigate to={paths.playerView} />} />
      <Route path={paths.playerView} element={<PlayerView />} />
    </Routes>
  );
}

function Layout() {
  return <Navbar />;
}

function NoMatch() {
  return (
    <div className="p-3">
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}
