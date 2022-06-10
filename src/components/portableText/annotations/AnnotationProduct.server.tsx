import type {
  PortableTextBlock,
  PortableTextMarkDefinition,
} from '@portabletext/types';
import {
  gql,
  ProductProvider,
  useSession,
  useShop,
  useShopQuery,
} from '@shopify/hydrogen';
import {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import type {SanityColorTheme, SanityProductWithVariant} from '../../../types';
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

export default function AnnotationProduct({children, colorTheme, mark}: Props) {
  const {productWithVariant} = mark;

  // Conditionally fetch Shopify document
  let storefrontProduct;
  let storefrontProductVariant;
  if (productWithVariant.gid && productWithVariant.variantGid) {
    const {languageCode} = useShop();
    const {countryCode = 'US'} = useSession();
    const {data} = useShopQuery<ShopifyPayload>({
      query: QUERY,
      variables: {
        country: countryCode,
        id: productWithVariant.gid,
        language: languageCode,
        variantId: productWithVariant.variantGid,
      },
    });
    storefrontProduct = data.product;
    storefrontProductVariant = data.productVariant;
  }

  if (!storefrontProduct || !storefrontProductVariant) {
    return <>{children}</>;
  }

  // TODO: refactor
  const storefrontProductWithVariant = {
    ...storefrontProduct,
    variants: {
      edges: [
        {
          node: storefrontProductVariant,
        },
      ],
    },
  };

  return (
    <ProductProvider
      data={storefrontProductWithVariant}
      initialVariantId={storefrontProductVariant.id}
    >
      <ProductInlineLink
        colorTheme={colorTheme}
        linkAction={mark.linkAction || 'link'}
        quantity={mark.quantity}
      >
        <>{children}</>
      </ProductInlineLink>
    </ProductProvider>
  );
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
