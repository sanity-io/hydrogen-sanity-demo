import groq from 'groq';

import {COLLECTION_PAGE} from './fragments/pages/collection';

export const COLLECTION_PAGE_QUERY = groq`
  *[
    _type == 'collection'
    && store.slug.current == $slug
  ][0]{
    ${COLLECTION_PAGE}
  }
`;
