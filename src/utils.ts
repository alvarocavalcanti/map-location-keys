import { Item, Metadata } from "@owlbear-rodeo/sdk";
import { LocationKey } from "./@types/types";
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
      const metadata = item.metadata[`${ID}/metadata`] as Metadata;
      newLocationKeys.push({
        description: metadata.locationKey as string,
        name: getItemText(item),
        id: item.id,
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
  return item.text.richText[0].children[0].text ? item.text.richText[0].children[0].text : item.text.plainText;
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
