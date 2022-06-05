import groq from 'groq';
import {COLOR_THEME} from './colorTheme';
import {HERO_COLLECTION} from './heroCollection';
import {MODULES} from './modules';
// TODO: rename SEO_PRODUCT or create separate version for collections
import {SEO_PRODUCT} from './seoProduct';

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
  seo {
    ${SEO_PRODUCT}
  },
  "slug": store.slug.current,
  "sortOrder": store.sortOrder,
  "title": store.title,
`;
