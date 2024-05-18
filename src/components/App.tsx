import OBR from "@owlbear-rodeo/sdk";
import React, { useEffect, useState } from "react";
import { Card, CardBody, Container } from "react-bootstrap";

import SPA from "./SPA";
import { BrowserRouter } from "react-router-dom";

const App: React.FC = () => {
  const [sceneReady, setSceneReady] = useState(false);
  useEffect(() => {
    OBR.scene.isReady().then(setSceneReady);
    return OBR.scene.onReadyChange(setSceneReady);
  }, []);

  if (sceneReady) {
    return (
      <BrowserRouter>
        <SPA />
      </BrowserRouter>
    );
  } else {
    return (
      <Container className="p-3">
        <Card className="mb-4">
          <CardBody>
            <Card.Title className="header">Map Location Keys</Card.Title>
            <Card.Text>
              Open a scene in order to use the Map Location Keys tool.
            </Card.Text>
          </CardBody>
        </Card>
      </Container>
    );
  }
};

export default App;
