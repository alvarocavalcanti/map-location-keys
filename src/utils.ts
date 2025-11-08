import { Item } from "@owlbear-rodeo/sdk";
import { LocationKey, FogKey } from "./@types/types";
import { ID } from "./main";

import Analytics from 'analytics';
import googleAnalytics from '@analytics/google-analytics';

export function loadExistingLocationKeys(
  items: Item[],
  newLocationKeys: LocationKey[],
  getItemText: (item: any) => any
) {
  for (const item of items) {
    if (item.metadata[`${ID}/metadata`]) {
      const metadata = item.metadata[`${ID}/metadata`] as any;
      const textItem = item as any;
      newLocationKeys.push({
        description: metadata.locationKey as string,
        name: getItemText(item),
        id: item.id,
        playerInfo: metadata.playerInfo || "",
        isPlayerVisible: metadata.isPlayerVisible || false,
        position: item.position,
        style: textItem.text?.style,
        textSize: textItem.text ? { width: textItem.text.width, height: textItem.text.height } : undefined,
        visible: item.visible,
      });
    }
  }
}

export function sortLocationKeys(newLocationKeys: LocationKey[]) {
  newLocationKeys.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
  });
}

export const getItemText = (item: any) => {
  if (item.text.richText && item.text.richText.length > 0) {
    return item.text.richText
      .map((line: any) => line.children.map((child: any) => child.text).join(''))
      .join(' ');
  }
  return item.text.plainText;
};

export const isDevMode = (): boolean => {
  return localStorage.getItem("dev-mode") === "true";
};

export const analytics = Analytics({
  app: 'awesome-app',
  plugins: [
    googleAnalytics({
      measurementIds: ['G-1TBFXRLMWR']
    })
  ]
})

export function loadExistingFogKeys(
  items: Item[],
  newFogKeys: FogKey[]
) {
  console.log("loadExistingFogKeys called with items:", items);
  console.log("Items count:", items.length);
  for (const item of items) {
    console.log("Checking item:", item.id, "layer:", item.layer, "type:", item.type);
    if (item.layer === "FOG" && (item.type === "SHAPE" || item.type === "PATH")) {
      const fogItem = item as any;
      console.log("Found FOG item:", item.id, item.type);

      const fogKey: FogKey = {
        id: item.id,
        name: item.name,
        type: item.type as "SHAPE" | "PATH",
        style: fogItem.style,
        position: item.position,
        visible: item.visible,
      };

      if (item.type === "SHAPE") {
        fogKey.width = fogItem.width;
        fogKey.height = fogItem.height;
        fogKey.shapeType = fogItem.shapeType;
      } else if (item.type === "PATH") {
        fogKey.commands = fogItem.commands;
        fogKey.fillRule = fogItem.fillRule;
      }

      newFogKeys.push(fogKey);
    }
  }
  console.log("Loaded fog keys:", newFogKeys.length);
}

export function sortFogKeys(newFogKeys: FogKey[]) {
  newFogKeys.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
  });
}
