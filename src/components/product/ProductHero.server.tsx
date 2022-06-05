import {gql, Image, useSession, useShop, useShopQuery} from '@shopify/hydrogen';
import {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import ProductHotspot from './ProductHotspot';

type Props = {
  gid: string;
  variantGid: string;
};

type ShopifyPayload = {
  productVariant: Pick<
    ProductVariant,
    'availableForSale' | 'compareAtPriceV2' | 'image' | 'priceV2'
  >;
  product: Pick<Product, 'handle' | 'id' | 'options' | 'title' | 'vendor'>;
};

export default function ProductHero({gid, variantGid}: Props) {
  const {countryCode = 'US'} = useSession();
  const {languageCode} = useShop();

  // Conditionally fetch Shopify document
  let storefrontProduct;
  let storefrontProductVariant;
  if (gid && variantGid) {
    const {data} = useShopQuery<ShopifyPayload>({
      query: QUERY,
      variables: {
        country: countryCode,
        language: languageCode,
        id: gid,
        variantId: variantGid,
      },
    });
    storefrontProduct = data?.product;
    storefrontProductVariant = data?.productVariant;
  }

  if (!storefrontProduct || !storefrontProductVariant) {
    return null;
  }

  return (
    <>
      {storefrontProductVariant.image && (
        <Image
          className="absolute h-full w-full transform bg-cover bg-center object-cover object-center"
          data={storefrontProductVariant.image}
          loaderOptions={{width: 2000}}
        />
      )}

      <div className="absolute bottom-4 right-4">
        <ProductHotspot
          storefrontProduct={storefrontProduct}
          storefrontProductVariant={storefrontProductVariant}
        />
      </div>
    </>
  );
}

const QUERY = gql`
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
