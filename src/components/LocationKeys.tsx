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
  Row,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import MarkdownRenderer from "./util/MarkdownRenderer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

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

  const togglePlayerVisibility = (id: string) => {
    track("toggle_player_visibility");
    analytics.track("toggle_player_visibility");
    OBR.scene.items.updateItems([id], (items) => {
      for (let item of items) {
        const metadata = item.metadata[`${ID}/metadata`] as any;
        if (metadata) {
          metadata.isPlayerVisible = !metadata.isPlayerVisible;
          item.metadata[`${ID}/metadata`] = metadata;
        }
      }
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

  return (
    <>
      {locationKeys.length > 0 ? (
        <>
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
                  <span className="me-2">{locationKey.name}</span>
                  {locationKey.isPlayerVisible && (
                    <FontAwesomeIcon
                      icon={faEye}
                      className="text-success"
                      title="Visible to players"
                    />
                  )}
                </Accordion.Header>
                <Accordion.Body className="py-1">
                  <div className="markdown-content">
                    <MarkdownRenderer>{locationKey.description || ""}</MarkdownRenderer>
                  </div>
                  <Row className="text-center mt-1">
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
                              playerInfo: locationKey.playerInfo,
                              isPlayerVisible: locationKey.isPlayerVisible,
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
                    <Col>
                      <Button
                        variant={
                          locationKey.isPlayerVisible
                            ? "success"
                            : "outline-secondary"
                        }
                        onClick={() => togglePlayerVisibility(locationKey.id)}
                        title={
                          locationKey.isPlayerVisible
                            ? "Hide from players"
                            : "Show to players"
                        }
                      >
                        <FontAwesomeIcon
                          icon={
                            locationKey.isPlayerVisible ? faEye : faEyeSlash
                          }
                        />
                      </Button>
                    </Col>
                    <Col>{""}</Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </>
      ) : (
        <Card className="mb-3">
          <CardBody className="py-2">
            <Card.Title className="header mb-2">No Location Keys</Card.Title>
            <Card.Text className="mb-0">
              The location keys will show up here once you add them. Click{" "}
              <Link to={paths.help}>here</Link> to learn how to do so.
            </Card.Text>
          </CardBody>
        </Card>
      )}
      <div className="p-2 text-center">
        <a href="https://www.buymeacoffee.com/alvarocavalcanti" target="_blank">
          <img
            src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
            alt="Buy Me A Coffee"
            style={{ height: "60px", width: "217px" }}
          />
        </a>
      </div>
    </>
  );
};

export default LocationKeys;
