import groq from 'groq';

import {MARK_DEFS} from '../portableText/markDefs';

export const MODULE_ACCORDION = groq`
  groups[] {
    _key,
    body[] {
      ...,
      markDefs[] {
        ${MARK_DEFS}
      }
    },
    title,
  }
`;
