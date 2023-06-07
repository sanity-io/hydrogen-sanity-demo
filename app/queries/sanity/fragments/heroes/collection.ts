import groq from 'groq';
import {z} from 'zod';

import {
  IMAGE_WITH_PRODUCT_HOTSPOTS,
  imageWithProductHotspotsSchema,
} from '../imageWithProductHotspots';
import {
  PRODUCT_WITH_VARIANT,
  productWithVariantSchema,
} from '../productWithVariant';

export const HERO_COLLECTION = groq`
  content[0] {
    _type,
    (_type == 'imageWithProductHotspots') => {
      ${IMAGE_WITH_PRODUCT_HOTSPOTS}
    },
    (_type == 'productWithVariant') => {
      ...${PRODUCT_WITH_VARIANT}
    },
  },
  description,
  title
`;

export const collectionHeroSchema = z.object({
  content: z.discriminatedUnion('_type', [
    imageWithProductHotspotsSchema.extend({
      _type: z.literal('imageWithProductHotspots'),
    }),
    productWithVariantSchema,
  ]),
  description: z.string(),
  title: z.string(),
});

type CollectionHero = z.infer<typeof collectionHeroSchema>;
export type {CollectionHero as SanityCollectionHero};
