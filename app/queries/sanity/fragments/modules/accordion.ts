import groq from 'groq';
import {z} from 'zod';

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

export const accordionModuleSchema = z.object({
  groups: z.object({
    _key: z.string(),
    // body:
    title: z.string(),
  }),
});

type AccordionModule = z.infer<typeof accordionModuleSchema>;
export type {AccordionModule as SanityAccorionModule};
