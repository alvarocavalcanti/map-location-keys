import OBR from "@owlbear-rodeo/sdk";
import { ID } from "./main";

function getItemText(item: any) {
  return item.text.richText[0].children[0].text;
}

export function setupInitiativeList(element: any) {
  const renderList = (items: any) => {
    const locationKeys = [];
    for (const item of items) {
      const metadata = item.metadata[`${ID}/metadata`];
      if (metadata) {
        locationKeys.push({
          locationKey: metadata.locationKey,
          name: getItemText(item),
        });
      }
    }
    // Sort so the highest initiative value is on top
    const sortedLocationKeys = locationKeys.sort(
      (a, b) => parseFloat(b.name) - parseFloat(a.name)
    );
    // Create new list nodes for each initiative item
    const nodes = [];
    for (const locationKey of sortedLocationKeys) {
      const node = document.createElement("li");
      node.innerHTML = `${locationKey.name}<br />${locationKey.locationKey}`;
      nodes.push(node);
    }
    element.replaceChildren(...nodes);
  };
  OBR.scene.items.onChange(renderList);
}