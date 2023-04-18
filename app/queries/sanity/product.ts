import groq from 'groq';

import {PRODUCT_PAGE} from './fragments/pages/product';

export const PRODUCT_PAGE_QUERY = groq`
  *[
    _type == 'product'
    && store.slug.current == $slug
  ][0]{
    ${PRODUCT_PAGE}
  }
`;
