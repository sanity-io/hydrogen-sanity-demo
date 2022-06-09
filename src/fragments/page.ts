import groq from 'groq';
import {COLOR_THEME} from './colorTheme';
import {HERO_PAGE} from './heroPage';
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
      ${HERO_PAGE}
    },
  },
  ${SEO},
  title,
`;
