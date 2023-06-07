import groq from 'groq';
import {z} from 'zod';

import {COLLECTION, collectionSchema} from '../collection';

export const MODULE_COLLECTION = groq`
  collection->{
    ${COLLECTION}
  },
  showBackground
`;

export const collectionModuleSchema = z.object({
  collection: collectionSchema,
  showBackground: z.boolean(),
});

type CollectionModule = z.infer<typeof collectionModuleSchema>;
export type {CollectionModule as SanityCollectionModule};
