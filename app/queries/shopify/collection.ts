import {PRODUCT_FIELDS} from '~/queries/shopify/product';
import {PRODUCT_VARIANT_FIELDS} from '~/queries/shopify/productVariant';

export const COLLECTION_QUERY = `#graphql
  ${PRODUCT_FIELDS}
  ${PRODUCT_VARIANT_FIELDS}

  	query CollectionDetails($country: CountryCode, $language: LanguageCode, $handle: String!, $count: Int!, $cursor: String)
    @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      title
      description
      handle
      products(first: $count, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          ...ProductFields
          variants(first: 1) {
            nodes {
              ...ProductVariantFields
            }
          }
        }
      }
    }
  }
`;
