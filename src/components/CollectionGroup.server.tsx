import {flattenConnection, useShopQuery} from '@shopify/hydrogen';
import {Product} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import gql from 'graphql-tag';
import type {SanityCollectionGroup} from '../types';
import CollectionGroupDialog from './CollectionGroupDialog.client';
// import CollectionGroupDialog from './CollectionGroupDialog.client';

type Props = {
  collectionGroup: SanityCollectionGroup;
};

export default function CollectionGroup({collectionGroup}: Props) {
  const collectionHandle =
    collectionGroup?.collectionProducts?.store.slug.current || '';

  // Fetch products
  const {data} = useShopQuery({
    query: QUERY_SHOPIFY,
    variables: {
      handle: collectionHandle,
      numProducts: 6,
    },
    preload: true,
  });

  const products: Product[] = data?.collection?.products
    ? flattenConnection(data.collection.products)
    : null;

  return (
    <CollectionGroupDialog
      collectionGroup={collectionGroup}
      products={products}
    />
  );
}

const QUERY_SHOPIFY = gql`
  query CollectionDetails($handle: String!, $numProducts: Int!) {
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
            title
            vendor
            handle
            descriptionHtml
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
          }
        }
      }
    }
  }
`;
