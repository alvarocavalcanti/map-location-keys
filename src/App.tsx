import React, { useState } from 'react';

import Container from 'react-bootstrap/Container';

interface AppProps {
  locationKeys: any[];
}

const App: React.FC<AppProps> = ({locationKeys}: AppProps) => {
  const [sLocationKeys] = useState(locationKeys);
  
  return (
    <Container className="p-3">
      <Container className="p-5 mb-4 bg-light rounded-3">
        <h1 className="header">
          Map Location Keys
        </h1>
      </Container>
      <ul id='location-keys'>
        {sLocationKeys.map((locationKey, index) => (
          <li key={index}>
            {locationKey.name}
            <br />
            {locationKey.locationKey}
          </li>
        ))}
      </ul>
    </Container>
  );
};

export default App;
