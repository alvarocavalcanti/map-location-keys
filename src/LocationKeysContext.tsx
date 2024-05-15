import * as React from 'react';
import createContextHook from './hooks/createContextHook';
import { LocationKey } from './types';

export interface LocationKeysContextProps {
  selectedLocationKey: LocationKey | null;
  setSelectedLocationKey: (locationKey: LocationKey) => void;
}

const LocationKeysContext = React.createContext<LocationKeysContextProps>({
  selectedLocationKey: null,
  setSelectedLocationKey: () => {},
});

interface LocationKeysProviderProps {
  children: React.ReactNode;
}
const LocationKeysProvider: React.FC<LocationKeysProviderProps> = ({
  children,
}) => {

  const [selectedLocationKey, setSelectedLocationKey] = React.useState<LocationKey | null>(null);

  return (
    <LocationKeysContext.Provider value={{ selectedLocationKey, setSelectedLocationKey }}>
      {children}
    </LocationKeysContext.Provider>
  );
};

const useLocationKeysContext = createContextHook(LocationKeysContext, 'LocationKeysProvider');

export { LocationKeysProvider, useLocationKeysContext };
