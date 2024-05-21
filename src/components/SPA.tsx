import React, { useEffect } from "react";
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
import { Container } from "react-bootstrap";
import Help from "./Help";

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
        <Route path="help" element={<Help state="HELP" />} />
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  );
}

function Layout() {
  return (
    <Container className="mb-4">
      <nav className="navbar navbar-dark bg-dark">
        <Link className="nav-item nav-link" to="/">
          Location Keys
        </Link>
        <Link className="nav-item nav-link" to="/help">
          Help
        </Link>
      </nav>
      <Outlet />
    </Container>
  );
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
