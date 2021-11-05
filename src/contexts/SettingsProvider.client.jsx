import SettingsContext from './SettingsContext.client';

const SettingsProvider = ({children, value}) => {
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
