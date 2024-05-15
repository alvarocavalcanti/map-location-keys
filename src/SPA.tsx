import { Routes, Route, Outlet, Link } from "react-router-dom";
import LocationKeys from "./LocationKeys";
import LocationKey from "./LocationKey";
import React from "react";

export const MyContext = React.createContext({});

export default function App() {

  return (
    <MyContext.Provider value={{}}>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route index element={<LocationKeys />} />
        <Route path="location-key/:id" element={<LocationKey />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </MyContext.Provider>
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