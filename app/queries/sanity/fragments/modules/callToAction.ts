import groq from 'groq';
import {z} from 'zod';

import {IMAGE, imageAssetSchema} from '../image';
import {LINK_EXTERNAL, linkExternalSchema} from '../linkExternal';
import {LINK_INTERNAL, linkInternalSchema} from '../linkInternal';
import {
  PRODUCT_WITH_VARIANT,
  productWithVariantSchema,
} from '../productWithVariant';

export const MODULE_CALL_TO_ACTION = groq`
  body,
  content[0] {
    _type,
    (_type == 'image') => {
      ${IMAGE}
    },
    (_type == 'productWithVariant') => {
      ...${PRODUCT_WITH_VARIANT}
    },
  },
  layout,
  "link": links[0] {
    (_type == 'linkExternal') => {
      ${LINK_EXTERNAL}
    },
    (_type == 'linkInternal') => {
      ${LINK_INTERNAL}
    },
  },
  title,
`;

export const callToActionModule = z.object({
  // body:
  content: z.discriminatedUnion('_type', [
    imageAssetSchema,
    productWithVariantSchema,
  ]),
  layout: z.union([z.literal('left'), z.literal('right')]),
  link: z.discriminatedUnion('_type', [linkExternalSchema, linkInternalSchema]),
  title: z.string(),
});

type CallToActionModule = z.infer<typeof callToActionModule>;
export type {CallToActionModule as SanityCallToActionModule};
