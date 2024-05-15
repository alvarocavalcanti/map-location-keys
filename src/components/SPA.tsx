import React from "react";
import { Link, Outlet, Route, Routes } from "react-router-dom";

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

export default function SPA() {
  const [selectedLocationKey, setSelectedLocationKey] = React.useState(
    {} as LocationKeyType
  );
  const [locationKeys, setLocationKeys] = React.useState<LocationKey[]>([]);

  const handleOnChange = (items: Item[]): void => {
    const newLocationKeys: LocationKey[] = [];

    loadExistingLocationKeys(items, newLocationKeys, getItemText);

    sortLocationKeys(newLocationKeys);

    setLocationKeys(newLocationKeys);
  };

  OBR.onReady(() => {
    setupContextMenu();
    OBR.scene.items.getItems().then((items) => handleOnChange(items));
  });

  return (
    <Routes>
      <Route path="/" element={<Layout />} />
      <Route
        index
        element={
          <LocationKeys
            setSelectedLocationKey={setSelectedLocationKey}
            locationKeys={locationKeys}
          />
        }
      />
      <Route
        path="location-key/:id"
        element={
          <LocationKey
            locationKey={selectedLocationKey}
            setSelectedLocationKey={setSelectedLocationKey}
          />
        }
      />
      <Route path="*" element={<NoMatch />} />
    </Routes>
  );
}

function Layout() {
  return <Outlet />;
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}
