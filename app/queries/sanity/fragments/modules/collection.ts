import groq from 'groq';

import {COLLECTION} from '../collection';

export const MODULE_COLLECTION = groq`
  collection->{
    ${COLLECTION}
  },
  showBackground
`;
