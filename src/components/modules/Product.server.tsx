import {gql, useSession, useShop, useShopQuery} from '@shopify/hydrogen';
import {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import type {SanityModuleProduct} from '../../types';
import ProductCard from '../product/Card';
import ProductPill from '../product/Pill';

type Props = {
  imageAspectClassName?: string;
  layout?: 'card' | 'pill';
  module?: SanityModuleProduct;
};

type ShopifyPayload = {
  product: Pick<
    Product,
    'handle' | 'id' | 'options' | 'title' | 'variants' | 'vendor'
  >;
  productVariant: Pick<
    ProductVariant,
    | 'availableForSale'
    | 'compareAtPriceV2'
    | 'id'
    | 'image'
    | 'priceV2'
    | 'selectedOptions'
    | 'title'
  >;
};

export default function ProductModule({
  imageAspectClassName,
  layout = 'card',
  module,
}: Props) {
  const productGid = module?.productWithVariant.gid;
  const productVariantGid = module?.productWithVariant.variantGid;

  // Conditionally fetch Shopify document
  let storefrontProduct;
  let storefrontProductVariant;
  if (productGid && productVariantGid) {
    const {languageCode} = useShop();
    const {countryCode = 'US'} = useSession();
    const {data} = useShopQuery<ShopifyPayload>({
      query: QUERY,
      variables: {
        country: countryCode,
        id: productGid,
        language: languageCode,
        variantId: productVariantGid,
      },
    });
    storefrontProduct = data.product;
    storefrontProductVariant = data.productVariant;
  }

  if (!storefrontProduct || !storefrontProductVariant) {
    return null;
  }

  if (layout === 'pill') {
    return (
      <ProductPill
        storefrontProduct={storefrontProduct}
        storefrontProductVariant={storefrontProductVariant}
      />
    );
  }

  if (layout === 'card') {
    return (
      <ProductCard
        imageAspectClassName={imageAspectClassName}
        storefrontProduct={storefrontProduct}
        storefrontProductVariant={storefrontProductVariant}
      />
    );
  }

  return null;
}

const QUERY = gql`
  query product(
    $country: CountryCode
    $id: ID!
    $language: LanguageCode
    $variantId: ID!
  ) @inContext(country: $country, language: $language) {
    product: product(id: $id) {
      handle
      id
      options {
        name
        values
      }
      title
      vendor
    }
    productVariant: node(id: $variantId) {
      ... on ProductVariant {
        availableForSale
        compareAtPriceV2 {
          amount
          currencyCode
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
          amount
          currencyCode
        }
        selectedOptions {
          name
          value
        }
        title
      }
    }
  }
`;
