import groq from 'groq';

import {IMAGE} from './image';
import {LINK_EXTERNAL} from './linkExternal';
import {LINK_INTERNAL} from './linkInternal';

// TODO: reduce overfetching for all block and mark defs here
// TODO: DRY `productWithVariant` blocks
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
      product->{
        ...,
        "variantId": coalesce(^.variant->store.id, store.variants[0]->store.id)
      }
    }
  },
  children[] {
    ...,
    (_type == 'blockInlineProduct') => {
      ...,
      productWithVariant {
        product->{
          ...,
          "variantId": coalesce(^.variant->store.id, store.variants[0]->store.id)
        }
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
        product->{
          ...,
          "variantId": coalesce(^.variant->store.id, store.variants[0]->store.id)
        }
      }
    },
    (_type == 'annotationProductMarginalia') => {
      ...,
      productWithVariant {
        product->{
          ...,
          "variantId": coalesce(^.variant->store.id, store.variants[0]->store.id)
        }
      }
    },
  }
`;
