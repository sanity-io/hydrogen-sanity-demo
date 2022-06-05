import {gql, useSession, useShop, useShopQuery} from '@shopify/hydrogen';
import {Collection} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import type {SanityCollectionGroup} from '../types';
import CollectionGroupDialog from './CollectionGroupDialog.client';

type Props = {
  collectionGroup: SanityCollectionGroup;
};

type ShopifyPayload = {
  collection: Collection;
};

export default function CollectionGroup({collectionGroup}: Props) {
  const collectionHandle =
    collectionGroup?.collectionProducts?.store.slug.current || '';

  const {countryCode = 'US'} = useSession();
  const {languageCode} = useShop();

  // Fetch collection
  const {data} = useShopQuery<ShopifyPayload>({
    query: QUERY_SHOPIFY,
    variables: {
      country: countryCode,
      handle: collectionHandle,
      language: languageCode,
      numProducts: 4,
    },
    preload: true,
  });

  return (
    <CollectionGroupDialog
      collection={data?.collection}
      collectionGroup={collectionGroup}
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
        altText
        height
        id
        url
        width
      }
      products(first: $numProducts) {
        edges {
          node {
            handle
            id
            options {
              name
              values
            }
            title
            variants(first: 1) {
              edges {
                node {
                  id
                  title
                  availableForSale
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
