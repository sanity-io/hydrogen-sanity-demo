import groq from 'groq';
import {z} from 'zod';

import {
  COLLECTION_PAGE,
  collectionPageSchema as collectionPageFragmentSchema,
} from './fragments/pages/collection';

export const COLLECTION_PAGE_QUERY = groq`
  *[
    _type == 'collection'
    && store.slug.current == $slug
  ] | order(_updatedAt desc) [0]{
    ${COLLECTION_PAGE}
  }
`;

export const collectionPageSchema = collectionPageFragmentSchema.extend({
  _type: z.literal('collection'),
});

type CollectionPage = z.infer<typeof collectionPageSchema>;
export type {CollectionPage as SanityCollectionPage};
