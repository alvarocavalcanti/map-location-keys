import React from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Form,
  Row,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import type { LocationKey } from "../@types/types";
import OBR from "@owlbear-rodeo/sdk";
import { ID } from "../main";
import { track } from "@vercel/analytics";
import { analytics } from "../utils";

const LocationKey: React.FC<{
  locationKey: LocationKey;
  setSelectedLocationKey: (locationKey: LocationKey) => void;
}> = ({ locationKey }) => {
  const [description, setDescription] = React.useState(
    locationKey.description || ""
  );
  const [playerInfo, setPlayerInfo] = React.useState(
    locationKey.playerInfo || ""
  );
  const [isPlayerVisible, setIsPlayerVisible] = React.useState(
    locationKey.isPlayerVisible || false
  );
  const navigate = useNavigate();

  const handleSave = () => {
    track("edit_location_key");
    analytics.track("edit_location_key");
    OBR.scene.items
      .updateItems(
        (item) => item.id === locationKey.id,
        (items) => {
          for (let item of items) {
            item.metadata[`${ID}/metadata`] = { 
              locationKey: description,
              playerInfo: playerInfo,
              isPlayerVisible: isPlayerVisible
            };
          }
        }
      )
      .then(() => {
        OBR.broadcast.sendMessage(`${ID}/broadcast`, `${locationKey.id}`, {
          destination: "LOCAL",
        });
        navigate("/");
      });
  };

  analytics.page();

  return (
    <>
      <Card className="mb-3">
        <CardBody className="py-2">
          <Card.Title className="header mb-0">Edit Location Key</Card.Title>
          <Card.Text className="mb-0">Name: {locationKey.name}</Card.Text>
        </CardBody>
      </Card>
      <Card className="mb-3">
        <Form>
          <Form.Group controlId="form.LocationKeyDetails">
            <CardBody className="py-2">
              <Card.Title className="header">Details</Card.Title>
              <Card.Text>
                <em>Markdown supported.</em>
              </Card.Text>
              <Form.Control
                as="textarea"
                rows={13}
                defaultValue={description}
                onChange={(e) => setDescription(e.target.value)}
                data-bs-theme="light"
                className="mb-3"
              />
              <Card.Title className="header">Player Information</Card.Title>
              <Card.Text>
                <em>Information visible to players when enabled (Markdown supported).</em>
              </Card.Text>
              <Form.Control
                as="textarea"
                rows={6}
                placeholder="Enter information that players will see when this location key is made visible to them..."
                value={playerInfo}
                onChange={(e) => setPlayerInfo(e.target.value)}
                data-bs-theme="light"
                className="mb-2"
              />
              <Form.Check
                type="checkbox"
                id="player-visibility-checkbox"
                label="Make visible to players"
                checked={isPlayerVisible}
                onChange={(e) => setIsPlayerVisible(e.target.checked)}
                className="mb-3"
              />
              <Row className="text-center mt-2">
                <Col>
                  <Button
                    variant="primary"
                    onClick={() => {
                      handleSave();
                    }}
                    className="me-2"
                  >
                    Save
                  </Button>
                </Col>
                <Col>
                  <Button
                    variant="danger"
                    onClick={() => {
                      navigate("/");
                    }}
                  >
                    Cancel
                  </Button>
                </Col>
                <Col>{""}</Col>
                <Col>{""}</Col>
              </Row>
            </CardBody>
          </Form.Group>
        </Form>
      </Card>
    </>
  );
};

export default LocationKey;
