import React from "react";
import { Accordion, Card, CardBody, Container } from "react-bootstrap";

const Help: React.FC = () => {
  const itemsAdd: { header: string; image: string, description?: string }[] = [
    {
      header: "1. Add or select an existing TEXT item",
      image: "img/help01.png",
      description: "Use one or two characters for optimal display, e.g. 'A1', 'B2', '7', '8a'.",
    },
    {
      header: '2. Click the "Add Location Key" button',
      image: "img/help02.png",
    },
    { header: "3. Edit Location Key's description", image: "img/help03.png" },
    { header: "4. Save your changes", image: "img/help04.png" },
  ];
  const itemsExport: { header: string; text: string }[] = [
    {
      header: "1. Click the Export button",
      text: "A YAML file will be downloaded to your computer.",
    },
  ];
  return (
    <>
      <Container className="p-3">
        <Card className="mb-2">
          <CardBody>
            <Card.Title>Adding Location Keys</Card.Title>
          </CardBody>
        </Card>
        <Accordion key="1">
          {itemsAdd.map((item, index) => (
            <Accordion.Item eventKey={String(index)} key={index}>
              <Accordion.Header>{item.header}</Accordion.Header>
              <Accordion.Body>
                {item.description && <p>{item.description}</p>}
                <img src={item.image} alt={item.header} className="img-fluid" />
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </Container>
      <Container className="p-3">
        <Card className="mb-2">
          <CardBody>
            <Card.Title>Exporting Location Keys</Card.Title>
          </CardBody>
        </Card>
        <Accordion key="1">
          {itemsExport.map((item, index) => (
            <Accordion.Item eventKey={String(index)} key={index}>
              <Accordion.Header>{item.header}</Accordion.Header>
              <Accordion.Body>{item.text}</Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </Container>
      <Container className="p-3 text-center">
      <a href="https://www.buymeacoffee.com/alvarocavalcanti" target="_blank">
        <img
          src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
          alt="Buy Me A Coffee"
          style={{ height: "60px", width: "217px" }}
        />
      </a>
      </Container>
    </>
  );
};

export default Help;
