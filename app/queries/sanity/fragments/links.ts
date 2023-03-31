import groq from 'groq';

import {COLLECTION_GROUP} from './collectionGroup';
import {LINK_EXTERNAL} from './linkExternal';
import {LINK_INTERNAL} from './linkInternal';

export const LINKS = groq`
  _key,
  (_type == 'collectionGroup') => {
    ${COLLECTION_GROUP}
  },
  (_type == 'linkGroup') => {
    _type,
    links[] {
      (_type == 'linkExternal') => {
        ${LINK_EXTERNAL}
      },
      (_type == 'linkInternal') => {
        ${LINK_INTERNAL}
      },
    },
    title
  },
  (_type == 'linkExternal') => {
    ${LINK_EXTERNAL}
  },
  (_type == 'linkInternal') => {
    ${LINK_INTERNAL}
  },
`;
