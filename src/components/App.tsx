import OBR from "@owlbear-rodeo/sdk";
import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";

import SceneNotReady from "./SceneNotReady";
import SPA from "./SPA";

const App: React.FC = () => {
  const [sceneReady, setSceneReady] = useState(false);
  useEffect(() => {
    OBR.scene.isReady().then(setSceneReady);
    return OBR.scene.onReadyChange(setSceneReady);
  }, []);

  return sceneReady ? (
    <BrowserRouter>
      <SPA />
    </BrowserRouter>
  ) : (
    <SceneNotReady />
  );
};

export default App;
