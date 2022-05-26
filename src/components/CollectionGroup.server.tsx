import {
  flattenConnection,
  useSession,
  useShop,
  useShopQuery,
} from '@shopify/hydrogen';
import {
  Collection,
  Product,
} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import gql from 'graphql-tag';
import type {SanityCollectionGroup} from '../types';
import CollectionGroupDialog from './CollectionGroupDialog.client';

type Props = {
  collectionGroup: SanityCollectionGroup;
};

type ShopifyPayload = {
  data: {
    collection: Collection;
  };
};

export default function CollectionGroup({collectionGroup}: Props) {
  const collectionHandle =
    collectionGroup?.collectionProducts?.store.slug.current || '';

  const {countryCode = 'US'} = useSession();
  const {languageCode} = useShop();
  // Fetch products
  const {data} = useShopQuery({
    query: QUERY_SHOPIFY,
    variables: {
      country: countryCode,
      handle: collectionHandle,
      language: languageCode,
      numProducts: 4,
    },
    preload: true,
  }) as ShopifyPayload;

  const products = data?.collection?.products
    ? (flattenConnection(data.collection.products) as Product[])
    : null;

  return (
    <CollectionGroupDialog
      collectionGroup={collectionGroup}
      products={products}
    />
  );
}

const QUERY_SHOPIFY = gql`
  query CollectionDetails(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
    $numProducts: Int!
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      title
      image {
        id
        url
        width
        height
        altText
      }
      products(first: $numProducts) {
        edges {
          node {
            compareAtPriceRange {
              maxVariantPrice {
                currencyCode
                amount
              }
              minVariantPrice {
                currencyCode
                amount
              }
            }
            handle
            id
            title
            variants(first: 1) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  image {
                    id
                    url
                    altText
                    width
                    height
                  }
                  priceV2 {
                    currencyCode
                    amount
                  }
                  compareAtPriceV2 {
                    currencyCode
                    amount
                  }
                }
              }
            }
            vendor
          }
        }
      }
    }
  }
`;
