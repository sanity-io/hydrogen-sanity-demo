import groq from 'groq';
import {z} from 'zod';

export const LINK_INTERNAL = groq`
  _key,
  _type,
  title,
  ...reference-> {
    "documentType": _type,
    (_type == "collection") => {
      "slug": "/collections/" + store.slug.current,
    },
    (_type == "home") => {
      "slug": "/",
    },
    (_type == "page") => {
      "slug": "/pages/" + slug.current,
    },
    (_type == "product" && store.isEnabled && store.status == "active") => {
      "slug": "/products/" + store.slug.current,
    },
  }
`;

export const linkInternalSchema = z.object({
  _key: z.string(),
  _type: z.literal('linkInternal'),
  title: z.string(),
  documentType: z.union([
    z.literal('collection'),
    z.literal('home'),
    z.literal('page'),
    z.literal('product'),
  ]),
  slug: z.string(),
});

type LinkInternal = z.infer<typeof linkInternalSchema>;
export type {LinkInternal as SanityLinkInternal};
