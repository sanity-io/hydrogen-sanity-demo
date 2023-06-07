import groq from 'groq';
import {z} from 'zod';

import {LINK_EXTERNAL, linkExternalSchema} from '../linkExternal';
import {LINK_INTERNAL, linkInternalSchema} from '../linkInternal';
import {
  PRODUCT_WITH_VARIANT,
  productWithVariantSchema,
} from '../productWithVariant';

export const MARK_DEFS = groq`
	...,
	(_type == 'annotationLinkExternal') => {
	  ${LINK_EXTERNAL}
	},
	(_type == 'annotationLinkInternal') => {
	${LINK_INTERNAL}
	},
	(_type == 'annotationProduct') => {
	  linkAction,
	  productWithVariant {
	    ...${PRODUCT_WITH_VARIANT}
	  },
	  (linkAction != 'link') => {
	    quantity
	  }
  },
`;

export const markDefsSchema = z.discriminatedUnion('_type', [
  linkExternalSchema.extend({_type: z.literal('annotationLinkExternal')}),
  linkInternalSchema.extend({_type: z.literal('annotationLinkInternal')}),
  z.object({
    _type: z.literal('annotationProduct'),
    linkAction: z.union([
      z.literal('addToCart'),
      z.literal('buyNow'),
      z.literal('link'),
    ]),
    quantity: z.number().nullish(),
    productWithVariant: productWithVariantSchema,
  }),
]);

type MarkDefs = z.infer<typeof markDefsSchema>;
export type {MarkDefs as SanityMarkDefs};
