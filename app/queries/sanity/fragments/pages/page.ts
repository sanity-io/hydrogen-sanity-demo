import groq from 'groq';

import {COLOR_THEME} from '../colorTheme';
import {HERO_PAGE} from '../heroes/page';
import {PORTABLE_TEXT} from '../portableText/portableText';
import {SEO} from '../seo';

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
