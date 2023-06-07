import groq from 'groq';
import {z} from 'zod';

import {HERO_HOME} from '../heroes/home';
import {MODULES} from '../modules';
import {SEO, seoSchema} from '../seo';

export const HOME_PAGE = groq`
  hero {
    ${HERO_HOME}
  },
  modules[] {
    ${MODULES}
  },
  ${SEO}
`;

export const homePageSchema = z
  .object({
    // hero:
    // modules:
  })
  .merge(seoSchema);

type HomePage = z.infer<typeof homePageSchema>;
export type {HomePage as SanityHomePage};
