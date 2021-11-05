import groq from 'groq';

import {DOCUMENT_SLUG} from './documentSlug';

export const LINK_INTERNAL = groq`
  _key,
  _type,
  title,
  ...reference-> {
    "documentType": _type,
    ${DOCUMENT_SLUG},
  }
`;
