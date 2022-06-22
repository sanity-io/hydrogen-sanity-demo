// prettier-ignore
// @ts-expect-error incompatibility with node16 resolution
import type { PortableTextBlock, PortableTextMarkDefinition } from '@portabletext/types';
import {gql, useLocalization, useShopQuery} from '@shopify/hydrogen';
import type {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';
import {PRODUCT_FIELDS} from '../../../fragments/shopify/product';
import {PRODUCT_VARIANT_FIELDS} from '../../../fragments/shopify/productVariant';
import type {
  ProductWithNodes,
  SanityColorTheme,
  SanityProductWithVariant,
} from '../../../types';
import ProductInlineLink from '../ProductInlineLink.client';

type Props = PortableTextBlock & {
  colorTheme?: SanityColorTheme;
  mark: PortableTextMarkDefinition & {
    linkAction: 'addToCart' | 'buyNow' | 'link';
    productWithVariant: SanityProductWithVariant;
    quantity?: number;
  };
};

type ShopifyPayload = {
  product: Partial<Product>;
  productVariant: Partial<ProductVariant>;
};

export default function ProductAnnotation({children, colorTheme, mark}: Props) {
  const {productWithVariant} = mark;

  // Conditionally fetch Shopify document
  let storefrontProduct: ProductWithNodes | null = null;

  if (productWithVariant.gid && productWithVariant.variantGid) {
    const {
      language: {isoCode: languageCode},
      country: {isoCode: countryCode},
    } = useLocalization();
    const {data} = useShopQuery<ShopifyPayload>({
      query: QUERY_SHOPIFY,
      variables: {
        country: countryCode,
        id: productWithVariant.gid,
        language: languageCode,
        variantId: productWithVariant.variantGid,
      },
    });
    // Attach variant nodes
    storefrontProduct = {
      ...data.product,
      variants: {nodes: [data.productVariant as ProductVariant]},
    };
  }

  if (!storefrontProduct) {
    return <>{children}</>;
  }

  return (
    <ProductInlineLink
      colorTheme={colorTheme}
      linkAction={mark.linkAction || 'link'}
      quantity={mark.quantity}
      storefrontProduct={storefrontProduct}
    >
      <>{children}</>
    </ProductInlineLink>
  );
}

const QUERY_SHOPIFY = gql`
  ${PRODUCT_FIELDS}
  ${PRODUCT_VARIANT_FIELDS}

  query product(
    $country: CountryCode
    $id: ID!
    $language: LanguageCode
    $variantId: ID!
  ) @inContext(country: $country, language: $language) {
    product: product(id: $id) {
      ...ProductFields
    }
    productVariant: node(id: $variantId) {
      ... on ProductVariant {
        ...ProductVariantFields
      }
    }
  }
`;
