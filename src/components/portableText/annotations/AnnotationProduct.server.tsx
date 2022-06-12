import type {
  PortableTextBlock,
  PortableTextMarkDefinition,
} from '@portabletext/types';
import {gql, useSession, useShop, useShopQuery} from '@shopify/hydrogen';
import type {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import type {
  ProductWithNodes,
  SanityColorTheme,
  SanityProductWithVariant,
} from '../../../types';
import ProductOptionsWrapper from '../../ProductOptionsWrapper.client';
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

export default function AnnotationProduct({children, colorTheme, mark}: Props) {
  const {productWithVariant} = mark;

  // Conditionally fetch Shopify document
  let storefrontProduct: ProductWithNodes | null = null;

  if (productWithVariant.gid && productWithVariant.variantGid) {
    const {languageCode} = useShop();
    const {countryCode = 'US'} = useSession();
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
    <ProductOptionsWrapper
      data={storefrontProduct}
      initialVariantId={storefrontProduct.variants?.nodes?.[0]?.id}
    >
      <ProductInlineLink
        colorTheme={colorTheme}
        linkAction={mark.linkAction || 'link'}
        quantity={mark.quantity}
        storefrontProduct={storefrontProduct}
      >
        <>{children}</>
      </ProductInlineLink>
    </ProductOptionsWrapper>
  );
}

const QUERY_SHOPIFY = gql`
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
