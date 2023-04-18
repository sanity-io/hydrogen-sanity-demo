import groq from 'groq';

import {IMAGE} from '../image';
import {LINK_EXTERNAL} from '../linkExternal';
import {LINK_INTERNAL} from '../linkInternal';
import {PRODUCT_WITH_VARIANT} from '../productWithVariant';

export const MODULE_CALL_TO_ACTION = groq`
  body,
  content[0] {
    _type,
    (_type == 'image') => {
      ${IMAGE}
    },
    (_type == 'productWithVariant') => {
      ...${PRODUCT_WITH_VARIANT}
    },
  },
  layout,
  "link": links[0] {
    (_type == 'linkExternal') => {
      ${LINK_EXTERNAL}
    },
    (_type == 'linkInternal') => {
      ${LINK_INTERNAL}
    },
  },
  title,
`;
