import React from "react";
import { Accordion, Card, CardBody, Container } from "react-bootstrap";
import { analytics } from "../utils";
import YouTube from "react-youtube";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBluesky } from "@fortawesome/free-brands-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faGlobeAfrica } from "@fortawesome/free-solid-svg-icons";

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
                <li>
                  <strong>playerInfo</strong> is an optional string that contains
                  information visible to players when the location key is shared with them.
                  Supports Markdown.
                </li>
                <li>
                  <strong>isPlayerVisible</strong> is an optional boolean that
                  determines if the location key is visible to players. Defaults to false.
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
  playerInfo: 'A mysterious room with ancient symbols on the walls.'
  isPlayerVisible: true
- description: |-
    # Other Evocative Name

    **Description:**

    **Features:**

    **Creatures:**

    **Notes:**
  name: '2'
  id: ''
  playerInfo: ''
  isPlayerVisible: false`}
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
      <Container className="mt-4">
        <Card className="mb-2">
          <CardBody>
            <Card.Title>Sharing Location Keys with Players</Card.Title>
          </CardBody>
        </Card>
        <Accordion key="3">
          <Accordion.Item eventKey="0" key={0}>
            <Accordion.Header>1. Add Player Information</Accordion.Header>
            <Accordion.Body>
              When editing a location key, you can add information specifically for players in the "Player Information" field. This content supports Markdown and will be shown to players when the location key is made visible to them.
              <br /><br />
              This field is separate from your GM notes, so you can include player-appropriate descriptions while keeping your GM-only information private.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1" key={1}>
            <Accordion.Header>2. Make Location Key Visible to Players</Accordion.Header>
            <Accordion.Body>
              You can make location keys visible to players in several ways:
              <ul>
                <li><strong>Edit Form:</strong> Check the "Make visible to players" checkbox when editing a location key</li>
                <li><strong>Context Menu:</strong> Right-click any location key and select "Toggle Player Visibility"</li>
                <li><strong>GM View:</strong> Click the eye icon button next to any location key to quickly toggle visibility</li>
              </ul>
              Location keys that are visible to players will show an eye icon (👁️) next to their name in the GM view.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2" key={2}>
            <Accordion.Header>3. Player Experience</Accordion.Header>
            <Accordion.Body>
              When players open the extension, they will see:
              <ul>
                <li>A "Location Information" section instead of the full GM interface</li>
                <li>Only location keys that you've marked as player-visible</li>
                <li>The custom "Player Information" content you've written for each location</li>
                <li>A "Show" button to navigate to each visible location</li>
              </ul>
              If no location keys are made visible to players, they'll see a message saying "Your GM hasn't shared any location information with players yet."
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Container>
      <Container className="mt-3 text-center">
        <a
          href="https://shadowcrawler.vercel.app"
          target="_blank"
          className="m-1"
        >
          <FontAwesomeIcon icon={faGlobeAfrica} /> shadowcrawler.vercel.app
        </a>
      </Container>
      <Container className="mt-3 text-center">
        <a
          href="https://github.com/alvarocavalcanti/shadowcrawler"
          target="_blank"
          className="m-1"
        >
          <FontAwesomeIcon icon={faGithub} /> alvarocavalcanti/shadowcrawler
        </a>
      </Container>
      <Container className="mt-3 text-center">
        <a
          href="https://bsky.app/profile/alvarocavalcanti.bsky.social"
          target="_blank"
          className="m-1"
        >
          <FontAwesomeIcon icon={faBluesky} /> alvarocavalcanti.bsky.social
        </a>
      </Container>
      <Container className="mt-3 text-center">
        <a
          href="https://twitter.com/alvarocavalcant"
          target="_blank"
          className="m-1"
        >
          <FontAwesomeIcon icon={faTwitter} /> alvarocavalcant
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
      <em className="text-secondary mb-3">
        Version: {version} |
        <a
          href="https://github.com/alvarocavalcanti/map-location-keys/blob/main/RELEASE-NOTES.md"
          target="_blank"
          rel="noopener noreferrer"
          className="text-secondary ms-1"
        >
          Release Notes
        </a>
      </em>
    </>
  );
};

export default Help;
