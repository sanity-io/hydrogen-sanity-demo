import groq from 'groq';
import {z} from 'zod';

import {
  HOME_PAGE,
  homePageSchema as homePageFragmentSchema,
} from './fragments/pages/home';

export const HOME_PAGE_QUERY = groq`
  *[_type == 'home'] | order(_updatedAt desc) [0]{
    ${HOME_PAGE}
  }
`;

export const homePageSchema = homePageFragmentSchema.extend({
  _type: z.literal('home'),
});

type HomePage = z.infer<typeof homePageSchema>;
export type {HomePage as SanityHomePage};
