import groq from 'groq';

import {MODULE_PRODUCT} from './product';

export const MODULE_PRODUCTS = groq`
  layout,
  modules[] {
    _key,
    ${MODULE_PRODUCT}
  }
`;
