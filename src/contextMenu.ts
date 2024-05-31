import OBR from "@owlbear-rodeo/sdk";
import { ID } from "./main";
import { track } from "@vercel/analytics";
import { analytics } from "./utils";

export const locationKeyTemplate = `# Evocative Name

**Description:**

**Features:**

**Creatures:**

**Notes:**`;

export function setupContextMenu() {
  OBR.contextMenu.create({
    id: `${ID}/context-menu-add-remove`,
    icons: [
      {
        icon: "/img/add.svg",
        label: "Add Location Key",
        filter: {
          every: [
            { key: "layer", value: "TEXT" },
            { key: ["metadata", `${ID}/metadata`], value: undefined },
          ],
        },
      },
      {
        icon: "/img/remove.svg",
        label: "Remove Location Key",
        filter: {
          every: [{ key: "layer", value: "TEXT" }],
        },
      },
    ],
    onClick(context) {
      const addToLocationKeys = context.items.every(
        (item) => item.metadata[`${ID}/metadata`] === undefined
      );

      if (addToLocationKeys) {
        track("add_to_location_keys");
        analytics.track("add_to_location_keys");
        OBR.scene.items.updateItems(context.items, (items) => {
          for (let item of items) {
            item.metadata[`${ID}/metadata`] = {
              locationKey: locationKeyTemplate,
            };
          }
        });
      } else {
        track("remove_from_location_keys");
        analytics.track("remove_from_location_keys");
        OBR.scene.items.updateItems(context.items, (items) => {
          for (let item of items) {
            delete item.metadata[`${ID}/metadata`];
          }
        });
      }
    },
  });
  OBR.contextMenu.create({
    id: `${ID}/context-menu-expand`,
    icons: [
      {
        icon: "/img/expand.svg",
        label: "Reveal Location Key",
        filter: {
          every: [{ key: "layer", value: "TEXT" }],
        },
      },
    ],
    onClick(context) {
      OBR.broadcast.sendMessage(`${ID}/broadcast`, `${context.items[0].id}`, {
        destination: "LOCAL",
      });
    },
  });
}
