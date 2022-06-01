import groq from 'groq';

// TODO: do we need the whole `store` object?
export const PRODUCT_WITH_VARIANT = groq`
  product->{
    _id,
    "available": !store.isDeleted && store.status == 'active',
    "slug": store.slug.current,
    store,
    "variantId": coalesce(^.variant->store.id, store.variants[0]->store.id)
  }
`;
