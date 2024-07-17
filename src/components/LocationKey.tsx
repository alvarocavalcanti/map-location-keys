import React from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
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
  const navigate = useNavigate();

  const handleSave = () => {
    track("edit_location_key");
    analytics.track("edit_location_key");
    OBR.scene.items
      .updateItems(
        (item) => item.id === locationKey.id,
        (items) => {
          for (let item of items) {
            item.metadata[`${ID}/metadata`] = { locationKey: description };
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
    <Container>
      <Card className="mb-4">
        <CardBody>
          <Card.Title className="header">Edit Location Key</Card.Title>
          <Card.Text>Name: {locationKey.name}</Card.Text>
        </CardBody>
      </Card>
      <Card className="mb-4">
        <Form>
          <Form.Group controlId="form.LocationKeyDetails">
            <CardBody>
              <Card.Title className="header">Details</Card.Title>
              <Card.Text>
                <em>Markdown supported.</em>
              </Card.Text>
              {/* #TODO: Use https://uiwjs.github.io/react-markdown-editor/ to add markdown support */}
              <Form.Control
                as="textarea"
                rows={13}
                defaultValue={description}
                onChange={(e) => setDescription(e.target.value)}
                data-bs-theme="light"
                className="mb-4"
              />
              <Row className="text-center">
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
    </Container>
  );
};

export default LocationKey;
