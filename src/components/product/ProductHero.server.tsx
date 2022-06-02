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

  // TODO: harden against undefined values

  const {data} = useShopQuery<ShopifyPayload>({
    query: QUERY,
    variables: {
      country: countryCode,
      language: languageCode,
      id: gid,
      variantId: variantGid,
    },
  });

  const storefrontProduct = data?.product;

  return (
    <>
      {data.productVariant.image && (
        <Image
          className="absolute h-full w-full transform bg-cover bg-center object-cover object-center"
          data={data.productVariant.image}
          loaderOptions={{width: 2000}}
        />
      )}

      <div className="absolute bottom-4 right-4">
        <ProductHotspot
          storefrontProduct={storefrontProduct}
          storefrontProductVariant={data.productVariant}
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
      vendor
    }
  }
`;
