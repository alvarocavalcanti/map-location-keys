import React from "react";
import { Card, CardBody, Container } from "react-bootstrap";

interface HelpProps {
  state: "HELP" | "EMPTY";
}

const Help: React.FC<HelpProps> = ({ state }) => {
  return (
    <Container className="p-3">
      <Card>
        <CardBody>
          <Card.Title>
            {state === "HELP" ? "How to Add Location Keys" : "No Location Keys"}
          </Card.Title>
        </CardBody>
      </Card>
      <ol className="list-group mt-4">
        <li className="list-group-item">
          <span className="badge badge-primary badge-pill">1</span>
          Add or select an existing TEXT item
        </li>
        <li className="list-group-item">
          <span className="badge badge-primary badge-pill">2</span>
          Click the "Add Location Key" button. The location will show up on
          the list with placeholder content
        </li>
        <li className="list-group-item">
          <span className="badge badge-primary badge-pill">3</span>
          In the location keys list, expand the location key and click
          "Edit"
        </li>
        <li className="list-group-item">
          <span className="badge badge-primary badge-pill">4</span>
          Update the content and then click "Save"
        </li>
      </ol>
    </Container>
  );
};

export default Help;
