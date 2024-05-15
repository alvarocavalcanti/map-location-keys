import React from "react";
import { Link, Outlet, Route, Routes } from "react-router-dom";

import LocationKey from "./LocationKey";
import LocationKeys from "./LocationKeys";

import type { LocationKey as LocationKeyType } from "./types";

export default function App() {
  const [selectedLocationKey, setSelectedLocationKey] = React.useState(
    {} as LocationKeyType
  );

  return (
    <Routes>
      <Route path="/" element={<Layout />} />
      <Route
        index
        element={
          <LocationKeys setSelectedLocationKey={setSelectedLocationKey} />
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
