import {gql, useSession, useShop, useShopQuery} from '@shopify/hydrogen';
import type {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import type {ProductWithNodes, SanityModuleProduct} from '../../types';
import ProductCard from '../product/Card.server';
import ProductPill from '../product/Pill';

type Props = {
  imageAspectClassName?: string;
  layout?: 'card' | 'pill';
  module?: SanityModuleProduct;
};

type ShopifyPayload = {
  product: Partial<Product>;
  productVariant: Partial<ProductVariant>;
};

export default function ProductModule({
  imageAspectClassName,
  layout = 'card',
  module,
}: Props) {
  const productGid = module?.productWithVariant.gid;
  const productVariantGid = module?.productWithVariant.variantGid;

  // Conditionally fetch Shopify document
  let storefrontProduct: ProductWithNodes | null = null;
  if (productGid && productVariantGid) {
    const {languageCode} = useShop();
    const {countryCode = 'US'} = useSession();
    const {data} = useShopQuery<ShopifyPayload>({
      query: QUERY_SHOPIFY,
      variables: {
        country: countryCode,
        id: productGid,
        language: languageCode,
        variantId: productVariantGid,
      },
    });

    // Attach variant nodes
    storefrontProduct = {
      ...data.product,
      variants: {nodes: [data.productVariant as ProductVariant]},
    };
  }

  if (!storefrontProduct) {
    return null;
  }

  if (layout === 'pill') {
    return <ProductPill storefrontProduct={storefrontProduct} />;
  }

  if (layout === 'card') {
    return (
      <ProductCard
        imageAspectClassName={imageAspectClassName}
        storefrontProduct={storefrontProduct}
      />
    );
  }

  return null;
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
