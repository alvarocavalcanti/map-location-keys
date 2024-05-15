import OBR from "@owlbear-rodeo/sdk";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";

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
        <Container className="mb-4 bg-light rounded-3">
          <h1 className="header">Open a scene to use the Map Location Keys</h1>
        </Container>
      </Container>
    );
  }
};

export default App;
