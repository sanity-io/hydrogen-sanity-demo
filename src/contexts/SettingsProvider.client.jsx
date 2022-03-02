import {createContext, useContext} from 'react';

const SettingsContext = createContext();

export default function SettingsProvider({children, value}) {
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsContext() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error('No settings context found');
  }

  return context;
}
