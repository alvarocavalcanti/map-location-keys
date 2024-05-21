import { LocationKey } from "../@types/types";
import OBR, { Player } from "@owlbear-rodeo/sdk";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Container,
} from "react-bootstrap";
import Markdown from "react-markdown";
import { Link } from "react-router-dom";
import remarkGfm from "remark-gfm";

import PlayerView from "./PlayerView";
import Help from "./Help";

const LocationKeys: React.FC<{
  setLocationKeyToEdit: (locationKey: LocationKey) => void;
  locationKeys: LocationKey[];
}> = ({ setLocationKeyToEdit: setLocationKeyToEdit, locationKeys }) => {
  const [role, setRole] = useState<"GM" | "PLAYER">("GM");

  useEffect(() => {
    const handlePlayerChange = (player: Player) => {
      setRole(player.role);
    };
    OBR.player.getRole().then(setRole);
    return OBR.player.onChange(handlePlayerChange);
  }, []);

  return role === "GM" ? (
    <Container className="p-3">
      <Card className="mb-4">
        <CardBody>
          <Card.Title className="header">Location Keys</Card.Title>
          <Card.Text>
            Location keys are used to provide additional information about
            locations on the map.
          </Card.Text>
        </CardBody>
      </Card>
      {locationKeys.length > 0 ? (
        locationKeys.map((locationKey, index) => (
          <Accordion key={index}>
            <Accordion.Item eventKey={locationKey.id}>
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
                        setLocationKeyToEdit({
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
        <Help state="EMPTY" />
      )}
    </Container>
  ) : (
    <PlayerView />
  );
};

export default LocationKeys;
