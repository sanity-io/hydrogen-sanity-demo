import groq from 'groq';
import {z} from 'zod';

import {MODULE_PRODUCT, productModuleSchema} from './product';

export const MODULE_PRODUCTS = groq`
  layout,
  modules[] {
    _key,
    ${MODULE_PRODUCT}
  }
`;

export const productsModuleSchema = z.object({
  layout: z.union([z.literal('left'), z.literal('right')]),
  modules: productModuleSchema.extend({
    _key: z.string(),
  }),
});

type ProductsModule = z.infer<typeof productsModuleSchema>;
export type {ProductsModule as SanityProductsModule};
