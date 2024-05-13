import OBR, { Item, Metadata } from '@owlbear-rodeo/sdk';
import React, { useState } from 'react';

import Accordion from 'react-bootstrap/Accordion';
import Container from 'react-bootstrap/Container';
import { setupContextMenu } from './contextMenu';
import { ID } from './main';

interface LocationKey { description: string; name: string; }

function loadExistingLocationKeys(items: Item[], newLocationKeys: LocationKey[], getItemText: (item: any) => any) {
  for (const item of items) {
    if (item.metadata[`${ID}/metadata`]) {
      const metadata = item.metadata[`${ID}/metadata`] as Metadata;
      newLocationKeys.push({
        description: metadata.locationKey as string,
        name: getItemText(item),
      });
    }
  }
}

function sortLocationKeys(newLocationKeys: LocationKey[]) {
  newLocationKeys.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
  });
}

const App: React.FC = () => {
  const [locationKeys, setLocationKeys] = useState<LocationKey[]>([]);

  const getItemText = (item: any) => {
    return item.text.richText[0].children[0].text;
  }
  
  const handleOnChange = (items: Item[]): void => {
    const newLocationKeys: LocationKey[] = [];
    
    loadExistingLocationKeys(items, newLocationKeys, getItemText);

    sortLocationKeys(newLocationKeys);

    setLocationKeys(newLocationKeys);
  }

  OBR.onReady(() => {
    setupContextMenu();
    OBR.scene.items.onChange(handleOnChange);
  });
  
  return (
    <Container className="p-3">
      <Container className="mb-4 bg-light rounded-3">
        <h1 className="header">
          Map Location Keys
        </h1>
      </Container>
      {locationKeys.length > 0 ? locationKeys.map((locationKey, index) => (
        <Accordion key={index}>
          <Accordion.Item eventKey={locationKey.name}>
            <Accordion.Header>
              {locationKey.name}
            </Accordion.Header>
            <Accordion.Body>
              {locationKey.description}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      )) : (
        <>
          No location keys found
        </>
      ) }
    </Container>
  );
};

export default App;
