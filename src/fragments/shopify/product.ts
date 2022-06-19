import {gql} from '@shopify/hydrogen';

export const PRODUCT_FIELDS = gql`
  fragment ProductFields on Product {
    handle
    id
    options {
      name
      values
    }
    title
    vendor
  }
`;
