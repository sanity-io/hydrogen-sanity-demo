import groq from 'groq';
import {LINK_EXTERNAL} from '../linkExternal';
import {LINK_INTERNAL} from '../linkInternal';

// TODO: refaactor mark defs
export const MODULE_ACCORDION = groq`
  groups[] {
    body[] {
      ...,
      markDefs[] {
        ...,
        (_type == 'annotationLinkExternal') => {
          ${LINK_EXTERNAL}
        },
        (_type == 'annotationLinkInternal') => {
          ${LINK_INTERNAL}
        },
      }
    },
    title,
  }
`;
