import React from 'react';

// The default value (`undefined`) will be used on the client
export const NonceContext = React.createContext<string | undefined>(undefined);
