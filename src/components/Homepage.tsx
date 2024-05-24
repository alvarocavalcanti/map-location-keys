import React from "react";
import { Col, Container, Row } from "react-bootstrap";

import Help from "./Help";

const Homepage: React.FC = () => {
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs lg="3"></Col>
        <Col md="6">
          <img
            src="https://map-location-keys.vercel.app/img/hero.png"
            alt="Map Location Keys"
            className="mb-4"
            width="640"
          />
          <h1>Map Location Keys</h1>
          <Container className="mb-4">
            <em>
              An{" "}
              <a href="https://owlbear.rodeo" target="_blank">
                Owlbear Rodeo
              </a>{" "}
              extension for adding location descriptions to a map.
              <br />
              By{" "}
              <a href="http://memorablenaton.es" target="_blank">
                Alvaro Cavalcanti
              </a>
              <br />
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
              <a
                href="https://github.com/alvarocavalcanti"
                target="_blank"
                className="m-1"
              >
                <img
                  src="https://img.shields.io/badge/GitHub-alvarocavalcanti-blue?style=flat-square&logo=github"
                  alt="GitHub Profile"
                />
              </a>
            </em>
          </Container>
          <h2>Overview</h2>
          <Container className="mb-4">
            With this extension you can add "location keys" to a map, which
            usually contain descriptions of a particular room or feature.
          </Container>

          <Container className="mb-4">
            It's almost like adding notes/post-its but they are only visible to
            the GM.
          </Container>

          <Container className="mb-4">
            You only need to add a text item to the map, ideally one or two
            characters long, eg: 1, 5a, B2, etc.
          </Container>

          <Container className="mb-4">
            Then using the context menu you can add it to the Location Keys.
            Now, using the drawer menu you can see a default description has
            been added for that item, but you can edit it as you like.
          </Container>

          <Container className="mb-4">
            The description supports Markdown and there are Import/Export
            features for handling several locations at a time.
          </Container>

          <Container className="mb-4">
            The idea here is to reduce tab switching between OBR and wherever
            your map descriptions are. With a little prep you can add the
            descriptions to OBR, ideally in a summarised form, and have a
            smoother experience.
          </Container>

          <h2>Features in Action</h2>
          <br />
          <h3>Adding a Location Key</h3>
          <video
            src="https://map-location-keys.vercel.app/video/01-add-location-key.mp4"
            width="640"
            height="480"
            controls
          ></video>
          <h3 className="mt-4">Removing a Location Key</h3>
          <video
            src="https://map-location-keys.vercel.app/video/02-remove-location-key.mp4"
            width="640"
            height="480"
            controls
          ></video>
          <h3 className="mt-4">Editing a Location Key</h3>
          <video
            src="https://map-location-keys.vercel.app/video/03-edit-location-key.mp4"
            width="640"
            height="480"
            controls
          ></video>
          <h3 className="mt-4">Import Location Keys</h3>
          <video
            src="https://map-location-keys.vercel.app/video/04-import-location-keys.mp4"
            width="640"
            height="480"
            controls
          ></video>
          <h3 className="mt-4">Showing a Location Key on the Map</h3>
          <video
            src="https://map-location-keys.vercel.app/video/05-show-location-key.mp4"
            width="640"
            height="480"
            controls
          ></video>
          <h3 className="mt-4">Exporting Location Keys</h3>
          <video
            src="https://map-location-keys.vercel.app/video/06-export-location-keys.mp4"
            width="640"
            height="480"
            controls
          ></video>

          <h2>Help Topics</h2>
          <Help />
        </Col>
        <Col xs lg="3"></Col>
      </Row>
    </Container>
  );
};

export default Homepage;
