import React from "react";
import { Button, ButtonGroup, Container, Form } from "react-bootstrap";
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
      <Container className="mb-4 bg-light rounded-3">
        <h1 className="header">Add Location Key for: {locationKey.name}</h1>
        <h5>Item ID: {locationKey.id}</h5>
      </Container>
      <Container className="mb-4">
        <Form>
          <Form.Group className="mb-3" controlId="form.LocationKeyDetails">
            <Form.Label>Details</Form.Label>
            <Form.Control
              as="textarea"
              rows={25}
              defaultValue={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <ButtonGroup className="mb-2">
              <Button
                variant="primary"
                onClick={() => {
                  handleSave();
                }}
              >
                Save
              </Button>
            </ButtonGroup>
            <ButtonGroup className="mb-2">
              <Link to="/">
                <Button variant="danger">Cancel</Button>
              </Link>
            </ButtonGroup>
          </Form.Group>
        </Form>
      </Container>
    </Container>
  );
};

export default LocationKey;
