import * as React from 'react';

const createContextHook = <T>(
  reactContext: React.Context<T>,
  providerName: string
) => (): T => {
  const context = React.useContext(reactContext);
  if (context === undefined) {
    throw new Error(`This hook must be used within a ${providerName}.`);
  }
  return context;
};

export default createContextHook;
