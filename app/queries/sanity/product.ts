import groq from 'groq';
import {z} from 'zod';

import {
  PRODUCT_PAGE,
  productPageSchema as productPageFragmentSchema,
} from './fragments/pages/product';

export const PRODUCT_PAGE_QUERY = groq`
  *[
    _type == 'product'
    && store.slug.current == $slug
  ] | order(_updatedAt desc) [0]{
    ${PRODUCT_PAGE}
  }
`;

export const productPageSchema = productPageFragmentSchema;

type ProductPage = z.infer<typeof productPageSchema>;
export type {ProductPage as SanityProductPage};
