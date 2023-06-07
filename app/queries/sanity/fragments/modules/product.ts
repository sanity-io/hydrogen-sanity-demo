import groq from 'groq';
import {z} from 'zod';

import {
  PRODUCT_WITH_VARIANT,
  productWithVariantSchema,
} from '../productWithVariant';

export const MODULE_PRODUCT = groq`
  productWithVariant {
    ...${PRODUCT_WITH_VARIANT}
  }
`;

export const productModuleSchema = z.object({
  productWithVariant: productWithVariantSchema,
});

type ProductModule = z.infer<typeof productModuleSchema>;
export type {ProductModule as SanityProductModule};
