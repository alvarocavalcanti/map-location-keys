import React from "react";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Container,
  Form,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import type { LocationKey } from "../@types/types";
import OBR from "@owlbear-rodeo/sdk";
import { ID } from "../main";

const LocationKey: React.FC<{
  locationKey: LocationKey;
  setSelectedLocationKey: (locationKey: LocationKey) => void;
}> = ({ locationKey }) => {
  const [description, setDescription] = React.useState(
    locationKey.description || ""
  );
  const navigate = useNavigate();

  const handleSave = () => {
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
        navigate("/");
      });
  };
  return (
    <Container className="p-3">
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
              <Form.Control
                as="textarea"
                rows={13}
                defaultValue={description}
                onChange={(e) => setDescription(e.target.value)}
                data-bs-theme="light"
              />
              <ButtonGroup className="mt-3">
                <Button
                  variant="primary"
                  onClick={() => {
                    handleSave();
                  }}
                  className="me-2"
                >
                  Save
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    navigate("/");
                  }}
                >
                  Cancel
                </Button>
              </ButtonGroup>
            </CardBody>
          </Form.Group>
        </Form>
      </Card>
    </Container>
  );
};

export default LocationKey;
