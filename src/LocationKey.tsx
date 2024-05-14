import OBR, { Metadata } from "@owlbear-rodeo/sdk";
import React, { useEffect } from "react";
import { Button, ButtonGroup, Container, Form } from "react-bootstrap";
import { ID } from "./main";

interface AddLocationKeyProps {
  locationName: string;
  locationItemID: string;
}

const AddLocationKey: React.FC<AddLocationKeyProps> = ({
  locationName,
  locationItemID,
}) => {
  const [itemId] = React.useState(locationItemID);
  const [description, setDescription] = React.useState("Loading description...");

  OBR.scene.items.getItems([itemId]).then((items) => {
    console.log(items);
    // const metadata = items[0].metadata[`${ID}/metadata`] as Metadata;
    // setDescription(metadata.locationKey as string);
    setDescription("Description loaded.");
  });

  return (
    <Container className="p-3">
      <Container className="mb-4 bg-light rounded-3">
        <h1 className="header">Add Location Key for: {locationName}</h1>
        <h5>Item ID: {itemId}</h5>
      </Container>
      <Container className="mb-4">
        <Form>
          <Form.Group className="mb-3" controlId="form.LocationKeyDetails">
            <Form.Label>Details</Form.Label>
            <Form.Control as="textarea" rows={25} value={description} onChange={() => {}}/>
            <ButtonGroup>
              <Button variant="primary">Save</Button>
              <Button variant="danger" href="/">Cancel</Button>
            </ButtonGroup>
          </Form.Group>
        </Form>
      </Container>
    </Container>
  );
};

export default AddLocationKey;
