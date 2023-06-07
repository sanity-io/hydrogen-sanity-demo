import groq from 'groq';
import {z} from 'zod';

export const IMAGE = groq`
  ...,
  "altText": asset->altText,
  "blurDataURL": asset->metadata.lqip,
  'height': asset->metadata.dimensions.height,
  'url': asset->url,
  'width': asset->metadata.dimensions.width,
`;

export const imageSchema = z
  .object({
    _type: z.literal('image'),
  })
  .passthrough();

export const imageAssetSchema = z
  .object({
    altText: z.string().nullish(),
    blurDataURL: z.string(),
    height: z.number(),
    width: z.number(),
    url: z.string().url(),
  })
  .merge(imageSchema);

type ImageAsset = z.infer<typeof imageAssetSchema>;
export type {ImageAsset as SanityAssetImage};
