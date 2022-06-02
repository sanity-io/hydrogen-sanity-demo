import groq from 'groq';
import {HERO_HOME} from './heroHome';
import {MODULES} from './modules';

export const HOME_PAGE = groq`
  hero {
    ${HERO_HOME}
  },
  modules[] {
    ${MODULES}
  },
`;
