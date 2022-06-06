import groq from 'groq';
import {IMAGE} from '../image';
import {LINK_EXTERNAL} from '../linkExternal';
import {LINK_INTERNAL} from '../linkInternal';
import {PRODUCT_WITH_VARIANT} from '../productWithVariant';

// TODO: refaactor mark defs
export const MODULE_GRID = groq`
  items[] {
    body[]{
      ...,
      markDefs[] {
        ...,
        (_type == 'annotationLinkExternal') => {
          ${LINK_EXTERNAL}
        },
        (_type == 'annotationLinkInternal') => {
          ${LINK_INTERNAL}
        },
        (_type == 'annotationProduct') => {
          linkAction,
          productWithVariant {
            ...${PRODUCT_WITH_VARIANT}
          },
          (linkAction != 'link') => {
            quantity
          }
        },
      }
    },
    image {
      ${IMAGE}
    },
    title
  }
`;
