import groq from 'groq';
import {z} from 'zod';

import {PAGE, pageSchema as pageFragmentSchema} from './fragments/pages/page';

export const PAGE_QUERY = groq`
  *[
    _type == 'page'
    && slug.current == $slug
  ] | order(_updatedAt desc) [0]{
    ${PAGE}
  }
`;

export const pageSchema = pageFragmentSchema.extend({
  _type: z.literal('page'),
});

type Page = z.infer<typeof pageSchema>;
export type {Page as SanityPage};
