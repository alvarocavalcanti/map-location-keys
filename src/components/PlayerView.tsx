import React, { useEffect, useState } from "react";
import {
  Accordion,
  Card,
  CardBody,
  Container,
  Button,
  Row,
  Col,
  Form
} from "react-bootstrap";
import OBR, { Item } from "@owlbear-rodeo/sdk";
import MarkdownRenderer from "./util/MarkdownRenderer";
import { LocationKey } from "../@types/types";
import { 
  getItemText,
  loadExistingLocationKeys,
  sortLocationKeys,
  analytics 
} from "../utils";
import { track } from "@vercel/analytics";
import { ID } from "../main";

const PlayerView: React.FC = () => {
  const [playerVisibleKeys, setPlayerVisibleKeys] = useState<LocationKey[]>([]);
  const [locationToReveal, setLocationToReveal] = useState<string>("");
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null);
  const [editedPlayerInfo, setEditedPlayerInfo] = useState<string>("");

  const handleToggleClick = (id: string) => {
    setLocationToReveal((prevKey) => (prevKey === id ? "" : id));
  };

  const handleEdit = (locationKey: LocationKey) => {
    setEditingLocationId(locationKey.id);
    setEditedPlayerInfo(locationKey.playerInfo || "");
  };

  const handleSave = (locationKey: LocationKey) => {
    track("player_edit_location_info");
    analytics.track("player_edit_location_info");
    OBR.scene.items.updateItems(
      (item) => item.id === locationKey.id,
      (items) => {
        for (let item of items) {
          const metadata = item.metadata[`${ID}/metadata`] as any;
          if (metadata) {
            metadata.playerInfo = editedPlayerInfo;
            item.metadata[`${ID}/metadata`] = metadata;
          }
        }
      }
    ).then(() => {
      setEditingLocationId(null);
      setEditedPlayerInfo("");
    });
  };

  const handleCancel = () => {
    setEditingLocationId(null);
    setEditedPlayerInfo("");
  };

  const showOnMap = (id: string) => {
    track("player_show_location_on_map");
    analytics.track("player_show_location_on_map");
    OBR.scene.items.getItemBounds([id]).then((bounds) => {
      OBR.viewport.animateToBounds({
        ...bounds,
        min: { x: bounds.min.x - 1000, y: bounds.min.y - 1000 },
        max: { x: bounds.max.x + 1000, y: bounds.max.y + 1000 },
      });
    });
  };

  const loadPlayerVisibleKeys = (items: Item[]): void => {
    const allLocationKeys: LocationKey[] = [];
    loadExistingLocationKeys(items, allLocationKeys, getItemText);

    const visibleKeys = allLocationKeys.filter(key => key.isPlayerVisible);
    sortLocationKeys(visibleKeys);

    setPlayerVisibleKeys(visibleKeys);
  };

  useEffect(() => {
    OBR.scene.items.onChange(loadPlayerVisibleKeys);
    OBR.scene.isReady().then(() => {
      OBR.scene.items.getItems().then(loadPlayerVisibleKeys);
    });

    OBR.broadcast.onMessage(`${ID}/broadcast`, (event) => {
      setLocationToReveal(event.data as string);
      window.document
        .getElementById(`player-accordion-${event.data as string}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, []);

  analytics.page();

  return (
    <Container>
      {playerVisibleKeys.length > 0 ? (
        <>
          <Card className="mt-3">
            <CardBody>
              <Card.Title className="header">Location Information</Card.Title>
              <Card.Text>
                Your GM has shared these location details with you.
              </Card.Text>
            </CardBody>
          </Card>
          <Accordion activeKey={locationToReveal}>
            {playerVisibleKeys.map((locationKey, index) => (
              <Accordion.Item
                eventKey={locationKey.id}
                key={String(index)}
                id={`player-accordion-${locationKey.id}`}
              >
                <Accordion.Header
                  onClick={() => {
                    handleToggleClick(locationKey.id);
                  }}
                >
                  {locationKey.name}
                </Accordion.Header>
                <Accordion.Body>
                  {editingLocationId === locationKey.id ? (
                    <>
                      <Form.Control
                        as="textarea"
                        rows={6}
                        value={editedPlayerInfo}
                        onChange={(e) => setEditedPlayerInfo(e.target.value)}
                        data-bs-theme="light"
                        className="mb-3"
                        placeholder="Enter your notes about this location..."
                      />
                      <Row className="text-center">
                        <Col>
                          <Button
                            variant="primary"
                            onClick={() => handleSave(locationKey)}
                          >
                            Save
                          </Button>
                        </Col>
                        <Col>
                          <Button
                            variant="danger"
                            onClick={handleCancel}
                          >
                            Cancel
                          </Button>
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
                      </Row>
                    </>
                  ) : (
                    <>
                      {locationKey.playerInfo ? (
                        <div className="markdown-content">
                          <MarkdownRenderer>{locationKey.playerInfo}</MarkdownRenderer>
                        </div>
                      ) : (
                        <p><em>No additional information provided.</em></p>
                      )}
                      <Row className="text-center">
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
                            variant="primary"
                            onClick={() => handleEdit(locationKey)}
                          >
                            Edit
                          </Button>
                        </Col>
                        <Col>{""}</Col>
                        <Col>{""}</Col>
                      </Row>
                    </>
                  )}
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </>
      ) : (
        <Card className="mb-4">
          <CardBody>
            <Card.Title className="header">No Location Information</Card.Title>
            <Card.Text>
              Your GM hasn't shared any location information with players yet.
            </Card.Text>
          </CardBody>
        </Card>
      )}
    </Container>
  );
};

export default PlayerView;
