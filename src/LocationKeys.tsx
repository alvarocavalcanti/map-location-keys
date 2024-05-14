import OBR, { Item, Metadata } from "@owlbear-rodeo/sdk";
import React, { useState } from "react";
import { Accordion, Button, ButtonGroup, Container } from "react-bootstrap";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { setupContextMenu } from "./contextMenu";
import LocationKey from "./LocationKey";
import { ID } from "./main";

interface LocationKey {
  description: string;
  name: string;
  id: string;
}

function loadExistingLocationKeys(
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

function sortLocationKeys(newLocationKeys: LocationKey[]) {
  newLocationKeys.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
  });
}

export const getItemText = (item: any) => {
  return item.text.richText[0].children[0].text;
};

const App: React.FC = () => {
  const [locationKeys, setLocationKeys] = useState<LocationKey[]>([]);

  const handleOnChange = (items: Item[]): void => {
    const newLocationKeys: LocationKey[] = [];

    loadExistingLocationKeys(items, newLocationKeys, getItemText);

    sortLocationKeys(newLocationKeys);

    setLocationKeys(newLocationKeys);
  };

  OBR.onReady(() => {
    setupContextMenu();
    OBR.scene.items.onChange(handleOnChange);
  });

  const queryParams = new URLSearchParams(window.location.search);
  const showLocationKey = queryParams.has("location-key");
  const locationName = queryParams.get("location-key");
  const locationItemId = queryParams.get("item-id");

  return showLocationKey ? (
    <LocationKey
      locationName={locationName as string}
      locationItemID={locationItemId as string}
    />
  ) : (
    <Container className="p-3">
      <Container className="mb-4 bg-light rounded-3">
        <h1 className="header">Map Location Keys</h1>
      </Container>
      {locationKeys.length > 0 ? (
        locationKeys.map((locationKey, index) => (
          <Accordion key={index}>
            <Accordion.Item eventKey={locationKey.name}>
              <Accordion.Header>{locationKey.name}</Accordion.Header>
              <Accordion.Body>
                <Markdown remarkPlugins={[remarkGfm]}>
                  {locationKey.description}
                </Markdown>
                <ButtonGroup>
                  <Button
                    variant="primary"
                    href={`?location-key=${locationKey.name}&item-id=${locationKey.id}`}
                  >
                    Edit
                  </Button>
                </ButtonGroup>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        ))
      ) : (
        <>No location keys have been added.</>
      )}
    </Container>
  );
};

export default App;
