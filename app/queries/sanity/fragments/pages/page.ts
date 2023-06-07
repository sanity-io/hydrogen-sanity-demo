import groq from 'groq';
import {z} from 'zod';

import {COLOR_THEME, colorThemeSchema} from '../colorTheme';
import {HERO_PAGE} from '../heroes/page';
import {PORTABLE_TEXT} from '../portableText/portableText';
import {SEO, seoSchema} from '../seo';

export const PAGE = groq`
  body[]{
    ${PORTABLE_TEXT}
  },
  colorTheme->{
    ${COLOR_THEME}
  },
  (showHero == true) => {
    hero {
      ${HERO_PAGE}
    },
  },
  ${SEO},
  title,
`;

export const pageSchema = z
  .object({
    // body:
    colorTheme: colorThemeSchema,
    // hero:
    title: z.string(),
  })
  .merge(seoSchema);

type Page = z.infer<typeof pageSchema>;
export type {Page as SanityPage};
