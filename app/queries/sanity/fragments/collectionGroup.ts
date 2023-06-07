import groq from 'groq';
import {z} from 'zod';

import {COLLECTION, collectionSchema} from './collection';

export const COLLECTION_GROUP = groq`
  _key,
  _type,
  collectionLinks[]->{
    _key,
    ${COLLECTION}
  },
  collectionProducts->{
    ${COLLECTION}
  },
  title,
`;

export const collectionGroupSchema = z.object({
  _key: z.string(),
  _type: z.literal('collectionGroup'),
  collectionLinks: collectionSchema
    .extend({
      _key: z.string(),
    })
    .array()
    .nullish(),
  collectionProducts: collectionSchema,
});

type CollectionGroup = z.infer<typeof collectionGroupSchema>;
export type {CollectionGroup as SanityCollectionGroup};
