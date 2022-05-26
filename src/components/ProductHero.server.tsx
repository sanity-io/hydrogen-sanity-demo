import {
  flattenConnection,
  Image,
  useSession,
  useShop,
  useShopQuery,
} from '@shopify/hydrogen';
import {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import gql from 'graphql-tag';
import ProductHotspot from './ProductHotspot';

type Props = {
  gid: string;
};

type ShopifyPayload = {
  product: Pick<
    Product,
    | 'compareAtPriceRange'
    | 'featuredImage'
    | 'handle'
    | 'id'
    | 'priceRange'
    | 'title'
    | 'variants'
    | 'vendor'
  >;
};

export default function ProductHero({gid}: Props) {
  const {countryCode = 'US'} = useSession();
  const {languageCode} = useShop();
  const {data} = useShopQuery<ShopifyPayload>({
    query: QUERY,
    variables: {
      country: countryCode,
      language: languageCode,
      id: gid,
    },
  });

  const storefrontProduct = data?.product;

  const selectedVariant = flattenConnection<ProductVariant>(
    storefrontProduct.variants,
  )[0];

  return (
    <>
      {selectedVariant.image && (
        <Image
          className="absolute h-full w-full transform bg-cover bg-center object-cover object-center"
          data={selectedVariant.image}
          loaderOptions={{width: 2000}}
        />
      )}

      <div className="absolute bottom-4 right-4">
        <ProductHotspot storefrontProduct={storefrontProduct} />
      </div>
    </>
  );
}

const QUERY = gql`
  query product($country: CountryCode, $language: LanguageCode, $id: ID!)
  @inContext(country: $country, language: $language) {
    product: product(id: $id) {
      compareAtPriceRange {
        maxVariantPrice {
          currencyCode
          amount
        }
        minVariantPrice {
          currencyCode
          amount
        }
      }
      featuredImage {
        url
        width
        height
        altText
      }
      handle
      id
      priceRange {
        maxVariantPrice {
          currencyCode
          amount
        }
        minVariantPrice {
          currencyCode
          amount
        }
      }
      title
      variants(first: 1) {
        edges {
          node {
            availableForSale
            compareAtPriceV2 {
              amount
              currencyCode
            }
            id
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
            selectedOptions {
              name
              value
            }
            sku
            title
            unitPrice {
              amount
              currencyCode
            }
            unitPriceMeasurement {
              measuredType
              quantityUnit
              quantityValue
              referenceUnit
              referenceValue
            }
          }
        }
      }
      vendor
    }
  }
`;
