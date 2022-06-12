import {gql, Image, useSession, useShop, useShopQuery} from '@shopify/hydrogen';
import type {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import ProductHotspot from './Hotspot';

type Props = {
  gid: string;
  variantGid: string;
};

type ShopifyPayload = {
  productVariant: Partial<ProductVariant>;
  product: Partial<Product>;
};

export default function ProductHero({gid, variantGid}: Props) {
  // Conditionally fetch Shopify document
  let storefrontProduct;
  if (gid && variantGid) {
    const {countryCode = 'US'} = useSession();
    const {languageCode} = useShop();
    const {data} = useShopQuery<ShopifyPayload>({
      query: QUERY_SHOPIFY,
      variables: {
        country: countryCode,
        language: languageCode,
        id: gid,
        variantId: variantGid,
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

  const firstVariant = storefrontProduct.variants.nodes[0];

  return (
    <>
      {firstVariant.image && (
        <Image
          className="absolute h-full w-full transform bg-cover bg-center object-cover object-center"
          data={firstVariant.image}
        />
      )}

      <div className="absolute bottom-4 right-4">
        <ProductHotspot storefrontProduct={storefrontProduct} />
      </div>
    </>
  );
}

const QUERY_SHOPIFY = gql`
  query product(
    $country: CountryCode
    $language: LanguageCode
    $id: ID!
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
        title
      }
    }
  }
`;
