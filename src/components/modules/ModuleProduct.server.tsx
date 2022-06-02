import {gql, useSession, useShop, useShopQuery} from '@shopify/hydrogen';
import {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import type {SanityModuleProduct} from '../../types';
import CardProduct from '../cards/CardProduct';

type Props = {
  imageAspectClassName?: string;
  module: SanityModuleProduct;
};

type ShopifyPayload = {
  productVariant: Pick<
    ProductVariant,
    'availableForSale' | 'compareAtPriceV2' | 'image' | 'priceV2'
  >;
  product: Pick<
    Product,
    'handle' | 'id' | 'options' | 'title' | 'variants' | 'vendor'
  >;
};

export default function ModuleProduct({imageAspectClassName, module}: Props) {
  const {languageCode} = useShop();
  const {countryCode = 'US'} = useSession();

  // TODO: harden against undefined values

  // Fetch Shopify document
  const {data} = useShopQuery<ShopifyPayload>({
    query: QUERY,
    variables: {
      country: countryCode,
      id: module.productWithVariant.store.gid,
      language: languageCode,
      variantId: module.productWithVariant.variantGid,
    },
  });

  return (
    <CardProduct
      imageAspectClassName={imageAspectClassName}
      storefrontProduct={data.product}
    />
  );
}

const QUERY = gql`
  query product(
    $country: CountryCode
    $id: ID!
    $language: LanguageCode
    $variantId: ID!
  ) @inContext(country: $country, language: $language) {
    productVariant: node(id: $variantId) {
      ... on ProductVariant {
        availableForSale
        compareAtPriceV2 {
          amount
          currencyCode
        }
        image {
          id
          url
          altText
          width
          height
        }
        priceV2 {
          amount
          currencyCode
        }
        title
      }
    }
    product: product(id: $id) {
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
`;
