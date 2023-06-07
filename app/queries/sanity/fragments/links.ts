import groq from 'groq';
import {z} from 'zod';

import {COLLECTION_GROUP, collectionGroupSchema} from './collectionGroup';
import {LINK_EXTERNAL, linkExternalSchema} from './linkExternal';
import {LINK_INTERNAL, linkInternalSchema} from './linkInternal';

export const LINKS = groq`
  _key,
  (_type == 'collectionGroup') => {
    ${COLLECTION_GROUP}
  },
  (_type == 'linkGroup') => {
    _type,
    links[] {
      (_type == 'linkExternal') => {
        ${LINK_EXTERNAL}
      },
      (_type == 'linkInternal') => {
        ${LINK_INTERNAL}
      },
    },
    title
  },
  (_type == 'linkExternal') => {
    ${LINK_EXTERNAL}
  },
  (_type == 'linkInternal') => {
    ${LINK_INTERNAL}
  },
`;

export const linksSchema = z.discriminatedUnion('_type', [
  // Collection Group
  collectionGroupSchema.extend({
    _key: z.string(),
    _type: z.literal('collectionGroup'),
  }),

  //  Link Group
  z.object({
    _key: z.string(),
    _type: z.literal('linkGroup'),
    title: z.string(),
  }),

  // External Link
  linkExternalSchema.extend({
    _key: z.string(),
    _type: z.literal('linkExternal'),
  }),

  // Internal Link
  linkInternalSchema.extend({
    _key: z.string(),
    _type: z.literal('linkInternal'),
  }),
]);

type Links = z.infer<typeof linksSchema>;
export type {Links as SanityLinks};
