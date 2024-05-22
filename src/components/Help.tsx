import React from "react";
import { Accordion, Card, CardBody, Container } from "react-bootstrap";

const Help: React.FC = () => {
  const items: { header: string; image: string }[] = [
    { header: "1. Add or select an existing TEXT item", image: "img/help01.png" },
    { header: "2. Click the \"Add Location Key\" button", image: "img/help02.png" },
    { header: "3. Edit Location Key's description", image: "img/help03.png" },
    { header: "4. Save your changes", image: "img/help04.png" }
  ];
  return (
    <Container className="p-3">
      <Card className="mb-4">
        <CardBody>
          <Card.Title>
            How to Add Location Keys
          </Card.Title>
        </CardBody>
      </Card>
      <Accordion key="1">
        {items.map((item, index) => (
          <Accordion.Item eventKey={String(index)} key={index}>
            <Accordion.Header>{item.header}</Accordion.Header>
            <Accordion.Body>
              <img src={item.image} alt={item.header} className="img-fluid" />
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>
  );
};

export default Help;
