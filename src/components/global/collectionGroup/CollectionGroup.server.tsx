import {gql, useLocalization, useShopQuery} from '@shopify/hydrogen';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';
import {PRODUCT_FIELDS} from '../../../fragments/shopify/product';
import {PRODUCT_VARIANT_FIELDS} from '../../../fragments/shopify/productVariant';
import type {SanityCollectionGroup} from '../../../types';
import CollectionGroupDialog from './CollectionGroupDialog.client';

type Props = {
  collectionGroup: SanityCollectionGroup;
};

type ShopifyPayload = {
  collection: Collection;
};

export default function CollectionGroup({collectionGroup}: Props) {
  const collectionGid = collectionGroup?.collectionProducts?.gid;
  const {
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();

  if (!collectionGid) {
    return null;
  }

  // Conditionally fetch Shopify collection
  const {data} = useShopQuery<ShopifyPayload>({
    query: QUERY_SHOPIFY,
    variables: {
      country: countryCode,
      id: collectionGid,
      language: languageCode,
      numProducts: 4,
    },
    preload: true,
  });

  return (
    <CollectionGroupDialog
      collection={data.collection}
      collectionGroup={collectionGroup}
    />
  );
}

const QUERY_SHOPIFY = gql`
  ${PRODUCT_FIELDS}
  ${PRODUCT_VARIANT_FIELDS}

  query CollectionDetails(
    $country: CountryCode
    $id: ID!
    $language: LanguageCode
    $numProducts: Int!
  ) @inContext(country: $country, language: $language) {
    collection(id: $id) {
      image {
        altText
        height
        id
        url
        width
      }
      products(first: $numProducts) {
        nodes {
          ...ProductFields
          variants(first: 1) {
            nodes {
              ...ProductVariantFields
            }
          }
        }
      }
      title
    }
  }
`;
