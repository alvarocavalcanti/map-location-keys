import { LocationKey } from "../@types/types";
import OBR from "@owlbear-rodeo/sdk";
import React from "react";
import {
  Accordion,
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
} from "react-bootstrap";
import Markdown from "react-markdown";
import { Link } from "react-router-dom";
import remarkGfm from "remark-gfm";

import { paths } from "./util/constants";

const LocationKeys: React.FC<{
  setLocationKeyToEdit: (locationKey: LocationKey) => void;
  locationKeys: LocationKey[];
}> = ({ setLocationKeyToEdit: setLocationKeyToEdit, locationKeys }) => {
  const showOnMap = (id: string) => {
    OBR.scene.items.getItemBounds([id]).then((bounds) => {
      OBR.viewport.animateToBounds({
        ...bounds,
        min: { x: bounds.min.x - 1000, y: bounds.min.y - 1000 },
        max: { x: bounds.max.x + 1000, y: bounds.max.y + 1000 },
      });
    });
  };

  return (
    <Container>
      {locationKeys.length > 0 && (
        <Card>
          <CardBody>
            <Card.Title className="header">Existing Location Keys</Card.Title>
          </CardBody>
        </Card>
      )}
      {locationKeys.length > 0 ? (
        locationKeys.map((locationKey, index) => (
          <Accordion key={index}>
            <Accordion.Item eventKey={locationKey.id}>
              <Accordion.Header>{locationKey.name}</Accordion.Header>
              <Accordion.Body>
                <Markdown remarkPlugins={[remarkGfm]}>
                  {locationKey.description}
                </Markdown>
                <Row className="text-center">
                  <Col>
                    <Link
                      to={`/location-key/${locationKey.name}?item-id=${locationKey.id}`}
                      className="gx-2"
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
                  </Col>
                  <Col>
                    <Button
                      variant="secondary"
                      onClick={() => showOnMap(locationKey.id)}
                    >
                      Show
                    </Button>
                  </Col>
                  <Col>{""}</Col>
                  <Col>{""}</Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        ))
      ) : (
        <Card className="mb-4">
          <CardBody>
            <Card.Title className="header">No Location Keys</Card.Title>
            <Card.Text>
              The location keys will show up here once you add them. Click{" "}
              <Link to={paths.help}>here</Link> to learn how to do so.
            </Card.Text>
          </CardBody>
        </Card>
      )}
    </Container>
  );
};

export default LocationKeys;
