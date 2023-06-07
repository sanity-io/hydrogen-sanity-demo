import groq from 'groq';
import {z} from 'zod';

import {COLOR_THEME, colorThemeSchema} from '../colorTheme';

export const NOT_FOUND_PAGE = groq`
  body,
  "collectionGid": collection->store.gid,
  colorTheme->{
    ${COLOR_THEME}
  },
  title
`;

export const notFoundPageSchema = z.object({
  // body:
  collectionGid: z.string(),
  colorTheme: colorThemeSchema,
  title: z.string(),
});

type NotFoundPage = z.infer<typeof notFoundPageSchema>;
export type {NotFoundPage as SanityNotFoundPage};
