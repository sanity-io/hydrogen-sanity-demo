import groq from 'groq';
import {z} from 'zod';

import {
  PRODUCT_WITH_VARIANT,
  productWithVariantSchema,
} from './productWithVariant';

export const PRODUCT_HOTSPOT = groq`
  _key,
  "product": productWithVariant {
    ...${PRODUCT_WITH_VARIANT}
  },
  x,
  y
`;

export const productHotspotSchema = z.object({
  _key: z.string(),
  product: productWithVariantSchema,
  x: z.number(),
  y: z.number(),
});

type ProductHotspot = z.infer<typeof productHotspotSchema>;
export type {ProductHotspot as SanityProductHotspot};
