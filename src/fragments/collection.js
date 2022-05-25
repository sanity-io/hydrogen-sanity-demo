import groq from 'groq';
import {COLOR_THEME} from './colorTheme';

export const COLLECTION = groq`
  _id,
  colorTheme->{
    ${COLOR_THEME}
  },
  "slug": "/collections/" + store.slug.current,
  store,
  "title": store.title
`;
