import groq from 'groq';
import {z} from 'zod';

import {COLOR_THEME} from './fragments/colorTheme';
import {LINKS, linksSchema} from './fragments/links';
import {notFoundPageSchema} from './fragments/pages/notFound';
import {PORTABLE_TEXT} from './fragments/portableText/portableText';
import {seoSchema} from './fragments/seo';

export const LAYOUT_QUERY = groq`
  *[_type == 'settings'] | order(_updatedAt desc) [0] {
    seo,
    "menuLinks": menu.links[] {
      ${LINKS}
    },
    footer {
      links[] {
        ${LINKS}
      },
      text[]{
        ${PORTABLE_TEXT}
      },
    },
    notFoundPage {
      body,
      "collectionGid": collection->store.gid,
      colorTheme->{
        ${COLOR_THEME}
      },
      title
    }
  }
`;

export const layoutSchema = z.object({
  _type: z.literal('settings'),
  seo: seoSchema,
  menuLinks: linksSchema.array(),
  footer: z.object({
    links: linksSchema.array(),
    // text:
  }),
  notFoundPage: notFoundPageSchema,
});

type Layout = z.infer<typeof layoutSchema>;
export type {Layout as SanityLayout};
