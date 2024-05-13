import OBR, { Item, Metadata } from '@owlbear-rodeo/sdk';
import React, { useState } from 'react';

import Container from 'react-bootstrap/Container';
import { setupContextMenu } from './contextMenu';
import { ID } from './main';

interface LocationKey { description: string; name: string; }

const App: React.FC = () => {
  const [locationKeys, setLocationKeys] = useState<LocationKey[]>([]);

  const getItemText = (item: any) => {
    return item.text.richText[0].children[0].text;
  }
  
  const handleOnChange = (items: Item[]): void => {
    const newLocationKeys: LocationKey[] = [];
    
    // Loads the existing location keys
    for (const item of items) {
      if (item.metadata[`${ID}/metadata`]) {
        const metadata = item.metadata[`${ID}/metadata`] as Metadata;
        newLocationKeys.push({
          description: metadata.locationKey as string,
          name: getItemText(item),
        });
      }
    }

    // Sorts the location keys by name
    newLocationKeys.sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
    });

    setLocationKeys(newLocationKeys);
  }

  OBR.onReady(() => {
    setupContextMenu();
    OBR.scene.items.onChange(handleOnChange);
  });
  
  return (
    <Container className="p-3">
      <Container className="p-5 mb-4 bg-light rounded-3">
        <h1 className="header">
          Map Location Keys
        </h1>
      </Container>
      <ul id='location-keys'>
        {locationKeys.map((locationKey, index) => (
          <li key={index}>
            {locationKey.name}
            <br />
            {locationKey.description}
          </li>
        ))}
      </ul>
    </Container>
  );
};

export default App;
