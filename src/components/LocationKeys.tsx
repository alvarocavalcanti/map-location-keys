import { LocationKey } from "../@types/types";
import OBR from "@owlbear-rodeo/sdk";
import { track } from "@vercel/analytics";
import React, { useEffect } from "react";
import {
  Accordion,
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
} from "react-bootstrap";
import { Remarkable } from 'remarkable';
import RemarkableReactRenderer from 'remarkable-react';
import { Link } from "react-router-dom";

import { ID } from "../main";
import { paths } from "./util/constants";
import { analytics } from "../utils";

const LocationKeys: React.FC<{
  setLocationKeyToEdit: (locationKey: LocationKey) => void;
  locationKeys: LocationKey[];
}> = ({ setLocationKeyToEdit: setLocationKeyToEdit, locationKeys }) => {
  const [locationToReveal, setLocationToReveal] = React.useState<string>("");

  const handleToggleClick = (id: string) => {
    setLocationToReveal((prevKey) => (prevKey === id ? "" : id));
  };

  const showOnMap = (id: string) => {
    track("show_location_key_on_map");
    analytics.track("show_location_key_on_map");
    OBR.scene.items.getItemBounds([id]).then((bounds) => {
      OBR.viewport.animateToBounds({
        ...bounds,
        min: { x: bounds.min.x - 1000, y: bounds.min.y - 1000 },
        max: { x: bounds.max.x + 1000, y: bounds.max.y + 1000 },
      });
    });
  };

  useEffect(() => {
    OBR.broadcast.onMessage(`${ID}/broadcast`, (event) => {
      setLocationToReveal(event.data as string);
      window.document
        .getElementById(`accordion-${event.data as string}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, []);

  analytics.page();

  const md = new Remarkable('full');
  md.renderer = new RemarkableReactRenderer();

  return (
    <Container>
      {locationKeys.length > 0 ? (
        <>
          <Card>
            <CardBody>
              <Card.Title className="header">Existing Location Keys</Card.Title>
            </CardBody>
          </Card>
          <Accordion activeKey={locationToReveal}>
            {locationKeys.map((locationKey, index) => (
              <Accordion.Item
                eventKey={locationKey.id}
                key={String(index)}
                id={`accordion-${locationKey.id}`}
              >
                <Accordion.Header
                  onClick={() => {
                    handleToggleClick(locationKey.id);
                  }}
                >
                  {locationKey.name}
                </Accordion.Header>
                <Accordion.Body>
                  {md.render(locationKey.description)}
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
            ))}
          </Accordion>
        </>
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
