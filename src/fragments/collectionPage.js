import groq from 'groq';
import {COLOR_THEME} from './colorTheme';
import {PAGE_HERO} from './pageHero';
// TODO: rename SEO_PRODUCT or create separate version for collections
import {SEO_PRODUCT} from './seoProduct';

export const COLLECTION_PAGE = groq`
  _id,
  colorTheme->{
    ${COLOR_THEME}
  },
  (showHero == true) => {
    hero {
      ${PAGE_HERO}
    },
  },
  seo {
    ${SEO_PRODUCT}
  },
  "slug": store.slug.current,
  "title": store.title,
`;
