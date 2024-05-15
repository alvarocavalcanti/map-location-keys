import React from "react";
import { Button, ButtonGroup, Container, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

import { useLocationKeysContext } from "./LocationKeysContext";

const LocationKey: React.FC = () => {
  const { selectedLocationKey } = useLocationKeysContext();

  return (
    <Container className="p-3">
      <Container className="mb-4 bg-light rounded-3">
        <h1 className="header">Add Location Key for: {selectedLocationKey?.name}</h1>
        <h5>Item ID: {selectedLocationKey?.id}</h5>
      </Container>
      <Container className="mb-4">
        <Form>
          <Form.Group className="mb-3" controlId="form.LocationKeyDetails">
            <Form.Label>Details</Form.Label>
            <Form.Control
              as="textarea"
              rows={25}
              value={selectedLocationKey?.description || ""}
              onChange={() => {}}
            />
            <ButtonGroup>
              <Button variant="primary">Save</Button>
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
