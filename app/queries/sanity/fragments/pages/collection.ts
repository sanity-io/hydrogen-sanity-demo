import groq from 'groq';

import {COLOR_THEME} from '../colorTheme';
import {HERO_COLLECTION} from '../heroes/collection';
import {MODULES} from '../modules';
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
