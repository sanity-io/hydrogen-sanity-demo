import groq from 'groq';
import {z} from 'zod';

export const LINK_EXTERNAL = groq`
    _key,
    _type,
    newWindow,
    title,
    url,
`;

export const linkExternalSchema = z.object({
  _key: z.string(),
  _type: z.literal('linkExternal'),
  newWindow: z.boolean().nullish(),
  url: z.string().url(),
  title: z.string(),
});

type LinkExternal = z.infer<typeof linkExternalSchema>;
export type {LinkExternal as SanityLinkExternal};
