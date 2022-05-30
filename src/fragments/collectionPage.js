import groq from 'groq';
import {COLOR_THEME} from './colorTheme';
import {HERO_COLLECTION} from './heroCollection';
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
  seo {
    ${SEO_PRODUCT}
  },
  "slug": store.slug.current,
  store,
  "title": store.title,
`;
