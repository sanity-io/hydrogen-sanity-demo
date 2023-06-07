import groq from 'groq';
import {z} from 'zod';

import {IMAGE, imageAssetSchema} from '../image';
import {LINK_EXTERNAL, linkExternalSchema} from '../linkExternal';
import {LINK_INTERNAL, linkInternalSchema} from '../linkInternal';
import {PRODUCT_HOTSPOT, productHotspotSchema} from '../productHotspot';
import {
  PRODUCT_WITH_VARIANT,
  productWithVariantSchema,
} from '../productWithVariant';

export const MODULE_IMAGE = groq`
  image {
    ${IMAGE}
  },
  (variant == 'callToAction') => {
    callToAction {
      "link": links[0] {
        (_type == 'linkExternal') => {
          ${LINK_EXTERNAL}
        },
        (_type == 'linkInternal') => {
          ${LINK_INTERNAL}
        },
      },
      title,
    }
  },
  (variant == 'caption') => {
    caption,
  },
  (variant == 'productHotspots') => {
    productHotspots[] {
      _key,
      ${PRODUCT_HOTSPOT}
    }
  },
  (variant == 'productTags') => {
    productTags[] {
      _key,
      ...${PRODUCT_WITH_VARIANT}
    },
  },
  variant,
`;

const imageModuleBaseSchema = z.object({
  image: imageAssetSchema,
});

export const imageModuleSchema = z.discriminatedUnion('variant', [
  // Call to Action
  imageModuleBaseSchema.extend({
    variant: z.literal('callToAction'),
    callToAction: z.object({
      link: z.discriminatedUnion('_type', [
        linkExternalSchema,
        linkInternalSchema,
      ]),
      title: z.string(),
    }),
  }),

  // Caption
  imageModuleBaseSchema.extend({
    variant: z.literal('caption'),
    caption: z.string(),
  }),

  // Product Hotspots
  imageModuleBaseSchema.extend({
    variant: z.literal('productHotspots'),
    productHotspots: productHotspotSchema.extend({_key: z.string()}).array(),
  }),

  // Product Tags
  imageModuleBaseSchema.extend({
    variant: z.literal('productTags'),
    productTags: productWithVariantSchema
      .extend({
        _key: z.string(),
      })
      .array(),
  }),
]);

type ImageModule = z.infer<typeof imageModuleBaseSchema>;
export type {ImageModule as SanityImageModule};
