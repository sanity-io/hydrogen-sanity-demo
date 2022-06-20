import groq from 'groq';
import {MODULE_ACCORDION} from '../modules/accordion';
import {MODULE_CALLOUT} from '../modules/callout';
import {MODULE_GRID} from '../modules/grid';
import {MODULE_IMAGES} from '../modules/images';
import {MODULE_INSTAGRAM} from '../modules/instagram';
import {MODULE_PRODUCTS} from '../modules/products';
import {MARK_DEFS} from './markDefs';

export const PORTABLE_TEXT = groq`
  ...,
  (_type == 'blockAccordion') => {
    ${MODULE_ACCORDION},
  },
  (_type == 'blockCallout') => {
    ${MODULE_CALLOUT}
  },
  (_type == 'blockGrid') => {
    ${MODULE_GRID},
  },
  (_type == 'blockImages') => {
    ${MODULE_IMAGES}
  },
  (_type == 'blockInstagram') => {
    ${MODULE_INSTAGRAM}
  },
  (_type == 'blockProducts') => {
    ${MODULE_PRODUCTS}
  },
  markDefs[] {
    ${MARK_DEFS}
  }
`;
