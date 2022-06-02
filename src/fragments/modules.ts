import groq from 'groq';
import {COLLECTION} from './collection';
import {IMAGE} from './image';
import {LINK_EXTERNAL} from './linkExternal';
import {LINK_INTERNAL} from './linkInternal';
import {PRODUCT_WITH_VARIANT} from './productWithVariant';

export const MODULES = groq`
  _key,
  _type,
  (_type == "module.callout") => {
    "link": links[0] {
      (_type == 'linkExternal') => {
        ${LINK_EXTERNAL}
      },
      (_type == 'linkInternal') => {
        ${LINK_INTERNAL}
      },
    },      
    text
  },
  (_type == "module.collection") => {
    collection->{
      ${COLLECTION}
    }
  },      
  (_type == "module.image") => {
    image {
      ${IMAGE}
    },
    (variant == 'callToAction') => {
      callToAction {
        "link": links[0] {
          (_type == 'linkExternal') => {
            ${LINK_EXTERNAL}
          },
          (_type == 'linkInternal') => {
            ${LINK_INTERNAL}
          },
        },      
        title,
      }
    },      
    (variant == 'caption') => {
      caption,
    },
    (variant == 'products') => {
      products[] {
        ...${PRODUCT_WITH_VARIANT}
      },
    },
    variant,
  },
  (_type == "module.instagram") => {
    url
  },      
  (_type == "module.product") => {
    productWithVariant {
      ${PRODUCT_WITH_VARIANT}
    }
  },      
`;
