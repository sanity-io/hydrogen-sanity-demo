import {gql} from '@shopify/hydrogen';

export const PRODUCT_VARIANT_FIELDS = gql`
  fragment ProductVariantFields on ProductVariant {
    availableForSale
    compareAtPriceV2 {
      currencyCode
      amount
    }
    id
    image {
      altText
      height
      id
      url
      width
    }
    priceV2 {
      currencyCode
      amount
    }
    selectedOptions {
      name
      value
    }
    title
  }
`;
