import groq from 'groq';

import {COLLECTION} from './collection';

export const COLLECTION_GROUP = groq`
  _key,
  _type,
  collectionLinks[]->{
    _key,
    ${COLLECTION}
  },
  collectionProducts->{
    ${COLLECTION}
  },
  title,
`;
