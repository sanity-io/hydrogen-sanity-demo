import groq from 'groq';
import {z} from 'zod';

export const PRODUCT_WITH_VARIANT = groq`
  product->{
    _id,
    "_type": "productWithVariant",
    "available": !store.isDeleted && store.status == 'active',
    "gid": store.gid,
    "slug": store.slug.current,
    "variantGid": coalesce(^.variant->store.gid, store.variants[0]->store.gid)
  }
`;

export const productWithVariantSchema = z.object({
  _id: z.string(),
  _key: z.string().nullish(),
  _type: z.literal('productWithVariant'),
  available: z.boolean(),
  gid: z.string(),
  slug: z.string().nullish(),
  variantGid: z.string(),
});

type ProductWithVariant = z.infer<typeof productWithVariantSchema>;
export type {ProductWithVariant as SanityProductWithVariant};
