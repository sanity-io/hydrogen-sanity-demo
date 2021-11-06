// Note: This must be a separate client component from your special Provider component.

import {createContext, useContext} from 'react';

const SettingsContext = createContext();

export default SettingsContext;

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error('No settings context found');
  }

  return context;
};
