import OBR from "@owlbear-rodeo/sdk";
import { ID } from "./main";

export function setupInitiativeList(element: any) {
  const renderList = (items: any) => {
    // Get the name and initiative of any item with
    // our initiative metadata
    const initiativeItems = [];
    for (const item of items) {
      const metadata = item.metadata[`${ID}/metadata`];
      if (metadata) {
        initiativeItems.push({
          initiative: metadata.initiative,
          name: item.name,
        });
      }
    }
    // Sort so the highest initiative value is on top
    const sortedItems = initiativeItems.sort(
      (a, b) => parseFloat(b.initiative) - parseFloat(a.initiative)
    );
    // Create new list nodes for each initiative item
    const nodes = [];
    for (const initiativeItem of sortedItems) {
      const node = document.createElement("li");
      node.innerHTML = `${initiativeItem.name} (${initiativeItem.initiative})`;
      nodes.push(node);
    }
    element.replaceChildren(...nodes);
  };
  OBR.scene.items.onChange(renderList);
}