import groq from 'groq';

import {LINK_EXTERNAL} from './linkExternal';
import {LINK_INTERNAL} from './linkInternal';

export const LINKS = groq`
  _key,
  (_type == 'linkExternal') => {
    ${LINK_EXTERNAL}
  },
  (_type == 'linkInternal') => {
    ${LINK_INTERNAL}
  },
`;
