import { createRoot } from "react-dom/client";

import App from "./components/App";

import "bootstrap/dist/css/bootstrap.min.css";
import PluginGate from "./components/PluginGate";

export const ID = "es.memorablenaton.map-location-keys";
const container = document.getElementById("app");
const root = createRoot(container!);

root.render(
  <PluginGate>
    <App />
  </PluginGate>
);
