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

export const HERO_PAGE = groq`
  content[0] {
    _type,
    (_type == 'imageWithProductHotspots') => {
      ${IMAGE_WITH_PRODUCT_HOTSPOTS}
    },
    (_type == 'productWithVariant') => {
      ...${PRODUCT_WITH_VARIANT}
    },
  },
  title
`;

export const pageHeroSchema = z.object({
  content: z.discriminatedUnion('_type', [
    imageWithProductHotspotsSchema.extend({
      _type: z.literal('imageWithProductHotspots'),
    }),
    productWithVariantSchema,
  ]),
  title: z.string(),
});

type HeroPage = z.infer<typeof pageHeroSchema>;
export type {HeroPage as SanityHeroPage};
