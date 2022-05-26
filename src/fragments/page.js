import groq from 'groq';
import {COLOR_THEME} from './colorTheme';
import {PAGE_HERO} from './pageHero';
import {PORTABLE_TEXT} from './portableText';
import {SEO} from './seo';

export const PAGE = groq`
  body[]{
    ${PORTABLE_TEXT}
  },
  colorTheme->{
    ${COLOR_THEME}
  },
  (showHero == true) => {
    hero {
      ${PAGE_HERO}
    },
  },
  seo {
    ${SEO}
  },
  title,
`;
