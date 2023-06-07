import groq from 'groq';
import {z} from 'zod';

import {COLOR_THEME, colorThemeSchema} from '../colorTheme';
import {
  CUSTOM_PRODUCT_OPTIONS,
  customProductOptionsSchema,
} from '../customProductOptions';
import {PORTABLE_TEXT} from '../portableText/portableText';
import {seoSchema} from '../seo';
import {SEO_SHOPIFY} from '../seoShopify';

export const PRODUCT_PAGE = groq`
  _id,
  "available": !store.isDeleted && store.status == 'active',
  body[]{
    ${PORTABLE_TEXT}
  },
  colorTheme->{
    ${COLOR_THEME}
  },
  "customProductOptions": *[_type == 'settings'][0].customProductOptions[title in ^.store.options[].name] {
    ${CUSTOM_PRODUCT_OPTIONS}
  },
  "gid": store.gid,
  ${SEO_SHOPIFY},
  "slug": store.slug.current,
`;

export const productPageSchema = z
  .object({
    _id: z.string(),
    available: z.boolean(),
    // body:
    colorTheme: colorThemeSchema,
    customProductOptions: customProductOptionsSchema.array(),
    gid: z.string(),
    slug: z.string(),
  })
  .merge(seoSchema);

type ProductPage = z.infer<typeof productPageSchema>;
export type {ProductPage as SanityProductPage};
