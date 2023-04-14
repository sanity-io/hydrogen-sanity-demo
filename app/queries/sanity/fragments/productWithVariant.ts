import groq from 'groq';

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
