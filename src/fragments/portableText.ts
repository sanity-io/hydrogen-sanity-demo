import groq from 'groq';
import {LINK_EXTERNAL} from './linkExternal';
import {LINK_INTERNAL} from './linkInternal';
import {MODULE_CALLOUT} from './modules/moduleCallout';
import {MODULE_IMAGES} from './modules/moduleImages';
import {MODULE_PRODUCTS} from './modules/moduleProducts';
import {PRODUCT_WITH_VARIANT} from './productWithVariant';

export const PORTABLE_TEXT = groq`
  ...,
  (_type == 'blockCallout') => {
    ${MODULE_CALLOUT}
  },
  (_type == 'blockImages') => {
    ${MODULE_IMAGES}
  },
  (_type == 'blockProducts') => {
    ${MODULE_PRODUCTS}
  },
  children[] {
    ...,
    (_type == 'blockInlineProduct') => {
      ...,
      productWithVariant {
        ${PRODUCT_WITH_VARIANT}
      }
    },
    (_type == 'blockInlineProductMarginalia') => {
      ...,
      productWithVariant {
        ${PRODUCT_WITH_VARIANT}
      }
    },
  },
  markDefs[] {
    ...,
    (_type == 'annotationLinkExternal') => {
      ${LINK_EXTERNAL}
    },
    (_type == 'annotationLinkInternal') => {
      ${LINK_INTERNAL}
    },
    (_type == 'annotationProduct') => {
      ...,
      productWithVariant {
        ${PRODUCT_WITH_VARIANT}
      }
    },
  }
`;
