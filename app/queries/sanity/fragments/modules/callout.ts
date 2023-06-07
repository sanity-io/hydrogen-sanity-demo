import groq from 'groq';
import {z} from 'zod';

import {LINK_EXTERNAL, linkExternalSchema} from '../linkExternal';
import {LINK_INTERNAL, linkInternalSchema} from '../linkInternal';

export const MODULE_CALLOUT = groq`
	"link": links[0] {
    (_type == 'linkExternal') => {
      ${LINK_EXTERNAL}
    },
    (_type == 'linkInternal') => {
      ${LINK_INTERNAL}
    },
  },
	text
`;

export const calloutModule = z.object({
  link: z.discriminatedUnion('_type', [linkExternalSchema, linkInternalSchema]),
  text: z.string(),
});

type CalloutModule = z.infer<typeof calloutModule>;
export type {CalloutModule as SanityCalloutModule};
