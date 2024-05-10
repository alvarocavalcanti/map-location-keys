import { setupContextMenu } from "./contextMenu";
import { setupInitiativeList } from "./initiativeList";
import "./style.css";
import OBR from "@owlbear-rodeo/sdk";

export const ID = "es.memorablenaton.map-location-keys";

const appElement = document.querySelector("#app");
if (appElement) {
  appElement.innerHTML = `
    <div>
      <h1>Initiative Tracker</h1>
      <ul id="initiative-list"></ul>
    </div>
  `;
}

OBR.onReady(() => {
  setupContextMenu();
  setupInitiativeList(document.querySelector("#initiative-list"));
});