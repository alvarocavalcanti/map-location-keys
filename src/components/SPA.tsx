import React, { useEffect } from "react";
import { Link, Route, Routes } from "react-router-dom";

import LocationKey from "./LocationKey";
import LocationKeys from "./LocationKeys";

import type { LocationKey as LocationKeyType } from "../@types/types";
import {
  getItemText,
  loadExistingLocationKeys,
  sortLocationKeys,
} from "../utils";
import OBR, { Item } from "@owlbear-rodeo/sdk";
import { setupContextMenu } from "../contextMenu";
import Help from "./Help";
import Navbar from "./Navbar";
import ImportExport from "./ImportExport";

export default function SPA() {
  const [locationKeyToEdit, setLocationKeyToEdit] = React.useState(
    {} as LocationKeyType
  );
  const [locationKeys, setLocationKeys] = React.useState<LocationKey[]>([]);

  const loadLocationKeys = (items: Item[]): void => {
    const newLocationKeys: LocationKey[] = [];

    loadExistingLocationKeys(items, newLocationKeys, getItemText);

    sortLocationKeys(newLocationKeys);

    setLocationKeys(newLocationKeys);
  };

  const setTheme = (theme: string): void => {
    document.getElementById("html_root")?.setAttribute("data-bs-theme", theme);
  };

  useEffect(() => {
    OBR.onReady(() => {
      setupContextMenu();
      OBR.scene.items
        .getItems((item) => {
          return item.layer === "TEXT";
        })
        .then((items) => loadLocationKeys(items));
      OBR.scene.items.onChange((items) => {
        loadLocationKeys(items.filter((item) => item.layer === "TEXT"));
      });
      OBR.theme.getTheme().then((theme) => {
        setTheme(theme.mode.toLowerCase());
      });
      OBR.theme.onChange((theme) => {
        setTheme(theme.mode.toLowerCase());
      });
    });
  }, []);

  return (
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
          path="location-key/:id"
          element={
            <LocationKey
              locationKey={locationKeyToEdit}
              setSelectedLocationKey={setLocationKeyToEdit}
            />
          }
        />
        <Route
          path="import-export"
          element={
            <ImportExport />
          }
        />
        <Route path="help" element={<Help />} />
        <Route path="*" element={<NoMatch />} />
      </Route>
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
