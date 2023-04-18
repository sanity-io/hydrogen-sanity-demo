import groq from 'groq';

import {IMAGE} from '../image';
import {MARK_DEFS} from '../portableText/markDefs';

export const MODULE_GRID = groq`
  items[] {
    _key,
    body[]{
      ...,
      markDefs[] {
        ${MARK_DEFS}
      }
    },
    image {
      ${IMAGE}
    },
    title
  }
`;
