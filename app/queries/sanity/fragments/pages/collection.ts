import groq from 'groq';
import {z} from 'zod';

import {COLOR_THEME, colorThemeSchema} from '../colorTheme';
import {HERO_COLLECTION} from '../heroes/collection';
import {MODULES} from '../modules';
import {seoSchema} from '../seo';
import {SEO_SHOPIFY} from '../seoShopify';

export const COLLECTION_PAGE = groq`
  _id,
  colorTheme->{
    ${COLOR_THEME}
  },
  (showHero == true) => {
    hero {
      ${HERO_COLLECTION}
    },
  },
  modules[] {
    ${MODULES}
  },
  ${SEO_SHOPIFY},
  "slug": store.slug.current,
  "sortOrder": store.sortOrder,
  "title": store.title,
`;

export const collectionPageSchema = z
  .object({
    _id: z.string(),
    colorTheme: colorThemeSchema,
    // hero:
    // modules:
    slug: z.string(),
    sortOrder: z.string(),
    title: z.string(),
  })
  .merge(seoSchema);

type CollectionPage = z.infer<typeof collectionPageSchema>;
export type {CollectionPage as SanityCollectionPage};
