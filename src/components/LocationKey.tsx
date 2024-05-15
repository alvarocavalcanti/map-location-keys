import React from "react";
import { Button, ButtonGroup, Container, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

import type { LocationKey } from "../@types/types";

const LocationKey: React.FC<{
  locationKey: LocationKey;
  setSelectedLocationKey: (locationKey: LocationKey) => void;
}> = ({ locationKey, setSelectedLocationKey }) => {
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
              value={locationKey.description || ""}
              onChange={() => {}}
            />
            <ButtonGroup>
              <Button variant="primary">Save</Button>
              {""}
              <Link to="/">
                <Button
                  variant="danger"
                  onClick={() => setSelectedLocationKey({} as LocationKey)}
                >
                  Cancel
                </Button>
              </Link>
            </ButtonGroup>
          </Form.Group>
        </Form>
      </Container>
    </Container>
  );
};

export default LocationKey;
