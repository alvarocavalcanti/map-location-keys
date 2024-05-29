import { createRoot } from "react-dom/client";

import App from "./components/App";

import "bootstrap/dist/css/bootstrap.min.css";
import PluginGate from "./components/PluginGate";
import Homepage from "./components/Homepage";

export const ID = "es.memorablenaton.map-location-keys";
const container = document.getElementById("app");
const root = createRoot(container!);

const urlParams = new URLSearchParams(window.location.search);
const isFromOBR = urlParams.has("obrref");

root.render(
  isFromOBR ? (
    <PluginGate>
      <App />
    </PluginGate>
  ) : (
    <Homepage />
  )
);
