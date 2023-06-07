import groq from 'groq';
import {z} from 'zod';

import {
  IMAGE_WITH_PRODUCT_HOTSPOTS,
  imageWithProductHotspotsSchema,
} from '../imageWithProductHotspots';
import {LINK_EXTERNAL, linkExternalSchema} from '../linkExternal';
import {LINK_INTERNAL, linkInternalSchema} from '../linkInternal';
import {
  PRODUCT_WITH_VARIANT,
  productWithVariantSchema,
} from '../productWithVariant';

export const HERO_HOME = groq`
  content[0] {
    _type,
    (_type == 'imageWithProductHotspots') => {
      ${IMAGE_WITH_PRODUCT_HOTSPOTS}
    },
    (_type == 'productWithVariant') => {
      ...${PRODUCT_WITH_VARIANT}
    },
  },
  "link": links[0] {
    (_type == 'linkExternal') => {
      ${LINK_EXTERNAL}
    },
    (_type == 'linkInternal') => {
      ${LINK_INTERNAL}
    },
  },
  title
`;

export const homeHeroSchema = z.object({
  content: z.discriminatedUnion('_type', [
    imageWithProductHotspotsSchema.extend({
      _type: z.literal('imageWithProductHotspots'),
    }),
    productWithVariantSchema,
  ]),
  link: z.discriminatedUnion('_type', [linkExternalSchema, linkInternalSchema]),
  title: z.string(),
});

type HomeHero = z.infer<typeof homeHeroSchema>;
export type {HomeHero as SanityHomeHero};
