import groq from 'groq';

import {PAGE} from './fragments/pages/page';

export const PAGE_QUERY = groq`
  *[
    _type == 'page'
    && slug.current == $slug
  ][0]{
    ${PAGE}
  }
`;
