import groq from 'groq';
import {z} from 'zod';

import {COLOR_THEME, colorThemeSchema} from './colorTheme';

export const COLLECTION = groq`
  _id,
  _type,
  colorTheme->{
    ${COLOR_THEME}
  },
  "gid": store.gid,
  "slug": "/collections/" + store.slug.current,
  "title": store.title,
  "vector": vector.asset->url,
`;

export const collectionSchema = z.object({
  _id: z.string(),
  _type: z.literal('collection'),
  colorTheme: colorThemeSchema,
  gid: z.string(),
  slug: z.string().nullish(),
  title: z.string(),
  vector: z.string().url().nullish(),
});

type Collection = z.infer<typeof collectionSchema>;
export type {Collection as SanityCollection};
