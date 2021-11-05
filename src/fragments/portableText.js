import groq from 'groq';

import {IMAGE} from './image';
import {LINK_EXTERNAL} from './linkExternal';
import {LINK_INTERNAL} from './linkInternal';

// TODO: reduce overfetching for all block and mark defs here
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
    product->{
      ...
    }
  },
  children[] {
    ...,
    (_type == 'blockInlineProduct') => {
      ...,
      product->{
        ...
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
      product->{
        ...
      }
    },
    (_type == 'annotationProductMarginalia') => {
      ...,
      product->{
        ...
      }
    },
  }
`;
