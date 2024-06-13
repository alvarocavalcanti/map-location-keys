import React from "react";
import { Accordion, Card, CardBody, Container } from "react-bootstrap";
import { analytics } from "../utils";
import YouTube from "react-youtube";

const Help: React.FC<{ version: string }> = ({ version }) => {
  const itemsAdd: { header: string; image: string; description?: string }[] = [
    {
      header: "1. Add or select an existing TEXT item",
      image: "img/help01.png",
      description:
        "Use one or two characters for optimal display, e.g. 'A1', 'B2', '7', '8a'.",
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

  analytics.page();

  const opts = {
    width: "300",
  };

  return (
    <>
      <Container>
        <Card className="mb-2">
          <CardBody>
            <Card.Title>Video Tutorial</Card.Title>
            <Card.Text>
              <YouTube videoId="jJM_600M1eo" opts={opts} />
            </Card.Text>
          </CardBody>
        </Card>
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
      <Container className="mt-4">
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
      <Container className="mt-4">
        <Card className="mb-2">
          <CardBody>
            <Card.Title>Importing Location Keys</Card.Title>
          </CardBody>
        </Card>
        <Accordion key="1">
          <Accordion.Item eventKey={"0"} key={0}>
            <Accordion.Header>1. Paste a valid YAML content</Accordion.Header>
            <Accordion.Body>
              Valid YAML content should be in the following format:
              <br className="mb-3" />
              <ul>
                <li>
                  <strong>description</strong> is a multiline string that can
                  contain markdown.
                  <br />
                </li>
                <li>
                  <strong>name</strong> is a string that represents the Location
                  Key. This will be the text of the TEXT item, please use one or
                  two characters for optimal display, e.g. 'A1', 'B2', '7', '8a'{" "}
                  <br />
                </li>
                <li>
                  <strong>id</strong> is a string that represents the ID of the
                  TEXT item. This is optional and can be left blank.
                </li>
              </ul>
              Example:
              <br className="mb-3" />
              <pre className="text-bg-secondary">
                {`- description: |-
  # Evocative Name

  **Description:**

  **Features:**

  **Creatures:**

  **Notes:**
name: '1'
id: ''
- description: |-
  # Other Evocative Name

  **Description:**

  **Features:**

  **Creatures:**

  **Notes:**
name: '2'
id: ''`}
              </pre>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey={"1"} key={1}>
            <Accordion.Header>2. Click Import</Accordion.Header>
            <Accordion.Body>
              If the content is valid, the Location Keys will be imported and
              added to the scene from the top left corner.
              <br />
              <img
                src="img/help05.png"
                alt="New Location Key items"
                className="img-fluid"
              />
              You can move them around as needed.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Container>
      <Container className="mt-3 text-center">
        <a
          href="https://twitter.com/alvarocavalcant"
          target="_blank"
          className="m-1"
        >
          <img
            src="https://img.shields.io/twitter/follow/alvarocavalcant?style=social"
            alt="Follow @alvarocavalcant on Twitter"
          />
        </a>
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
      <em className="text-secondary mb-3">Version: {version}</em>
    </>
  );
};

export default Help;
