import OBR from "@owlbear-rodeo/sdk";

import App from './App';
import { setupContextMenu } from "./contextMenu";
import { setupInitiativeList } from "./initiativeList";

import 'bootstrap/dist/css/bootstrap.min.css';


import { createRoot } from 'react-dom/client';

export const ID = "es.memorablenaton.map-location-keys";
const container = document.getElementById('app');
const root = createRoot(container!);

root.render(<App locationKeys={[]} />);

OBR.onReady(() => {
  setupContextMenu();
  setupInitiativeList(document.querySelector("#location-keys"));
});
