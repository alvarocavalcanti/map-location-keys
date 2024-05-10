import OBR from "@owlbear-rodeo/sdk";
import { ID } from "./main";

export function setupContextMenu() {
  OBR.contextMenu.create({
    id: `${ID}/context-menu`,
    icons: [
      {
        icon: "/add.svg",
        label: "Add Location Key",
        filter: {
          every: [
            { key: "layer", value: "TEXT" },
            { key: ["metadata", `${ID}/metadata`], value: undefined },
          ],
        },
      },
      {
        icon: "/remove.svg",
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
        const locationKey = `
          # This is a location key\n
          \n
          **Location Key:**\n
          \n
          **Description:**\n
          \n
          **Features:**\n
          \n
          **Creatures:**\n
          \n
          **Notes:**\n
          \n
          ---\n
          \n
        `;
        OBR.scene.items.updateItems(context.items, (items) => {
          for (let item of items) {
            item.metadata[`${ID}/metadata`] = {
              locationKey: locationKey,
            };
          }
        });
      } else {
        OBR.scene.items.updateItems(context.items, (items) => {
          for (let item of items) {
            delete item.metadata[`${ID}/metadata`]
          }
        });
      }
    },
  });
}
