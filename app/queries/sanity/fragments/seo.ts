import groq from 'groq';
import {z} from 'zod';

import {IMAGE, imageAssetSchema} from './image';

export const SEO = groq`
  "seo": {
    "description": seo.description,
    "image": seo.image {
      ${IMAGE}
    },
    "title": coalesce(seo.title, title),
  }
`;

export const seoSchema = z.object({
  seo: z.object({
    description: z.string().nullish(),
    image: imageAssetSchema.nullish(),
    title: z.string(),
  }),
});

type Seo = z.infer<typeof seoSchema>;
export type {Seo as SanitySeo};
