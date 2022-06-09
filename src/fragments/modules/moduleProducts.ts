import groq from 'groq';
import {MODULE_PRODUCT} from './moduleProduct';

export const MODULE_PRODUCTS = groq`  
  layout,
  modules[] {
    _key,
    ${MODULE_PRODUCT}
  }
`;
