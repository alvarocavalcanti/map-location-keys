import { LocationKey } from "../@types/types";
import OBR, { Player } from "@owlbear-rodeo/sdk";
import React, { useEffect, useState } from "react";
import { Accordion, Button, ButtonGroup, Container } from "react-bootstrap";
import Markdown from "react-markdown";
import { Link } from "react-router-dom";
import remarkGfm from "remark-gfm";

const LocationKeys: React.FC<{
  setSelectedLocationKey: (locationKey: LocationKey) => void;
  locationKeys: LocationKey[];
}> = ({ setSelectedLocationKey, locationKeys }) => {
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
                        setSelectedLocationKey({
                          id: locationKey.id,
                          name: locationKey.name,
                          description: locationKey.description,
                        })
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
