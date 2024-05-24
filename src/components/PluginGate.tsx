import OBR from "@owlbear-rodeo/sdk";
import React, { useEffect, useState } from "react";

import Homepage from "./Homepage";

/**
 * Only render the children when we're within a plugin
 * and that plugin is ready.
 */
const PluginGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (OBR.isAvailable) {
      OBR.onReady(() => setReady(true));
    }
  }, []);
  if (ready) {
    return <>{children}</>;
  } else {
    return <Homepage />;
  }
};

export default PluginGate;
