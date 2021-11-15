import groq from 'groq';

import {IMAGE} from './image';
import {LINK_EXTERNAL} from './linkExternal';
import {LINK_INTERNAL} from './linkInternal';
import {PRODUCT_WITH_VARIANT} from './productWithVariant';

export const PORTABLE_TEXT = groq`
  ...,
  (_type == 'blockImage') => {
    ...,
    image {
      ${IMAGE}
    }
  },
  (_type == 'blockProduct') => {
    ...,
    productWithVariant {
      ${PRODUCT_WITH_VARIANT}
    }
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
