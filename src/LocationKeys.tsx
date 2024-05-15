import OBR, { Item, Metadata, Player } from "@owlbear-rodeo/sdk";
import React, { useEffect, useState } from "react";
import { Accordion, Button, ButtonGroup, Container } from "react-bootstrap";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { setupContextMenu } from "./contextMenu";
import { ID } from "./main";
import { Link } from "react-router-dom";
import { useLocationKeysContext } from "./LocationKeysContext";
import { LocationKey } from "./types";

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

const LocationKeys: React.FC = () => {
  const { setSelectedLocationKey } = useLocationKeysContext();
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

  const [role, setRole] = useState<"GM" | "PLAYER">("PLAYER");

  useEffect(() => {
    const handlePlayerChange = (player: Player) => {
      setRole(player.role);
    };
    OBR.player.getRole().then(setRole);
    return OBR.player.onChange(handlePlayerChange);
  }, []);

  if (role === "PLAYER") {
    return <>Only the GM can view location keys.</>;
  }

  function handleOnEdit(id: string, name: string, description: string): void {
    setSelectedLocationKey({ id, name, description });
  }

  return (
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
                  <Link
                    to={`/location-key/${locationKey.name}?item-id=${locationKey.id}`}
                  >
                    <Button
                      variant="primary"
                      onClick={() =>
                        handleOnEdit(
                          locationKey.id,
                          locationKey.name,
                          locationKey.description
                        )
                      }
                    >
                      Edit
                    </Button>
                  </Link>
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

export default LocationKeys;
