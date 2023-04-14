import groq from 'groq';

import {COLOR_THEME} from '../colorTheme';

export const NOT_FOUND_PAGE = groq`
  body,
  "collectionGid": collection->store.gid,
  colorTheme->{
    ${COLOR_THEME}
  },
  title
`;
