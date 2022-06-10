import {gql, useSession, useShop, useShopQuery} from '@shopify/hydrogen';
import {Product} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import clsx from 'clsx';
import {SanityColorTheme} from '../../types';
import ProductCard from './Card';

type Props = {
  colorTheme?: SanityColorTheme;
  storefrontProduct: Pick<
    Product,
    'handle' | 'id' | 'title' | 'variants' | 'vendor'
  >;
};

type ShopifyPayload = {
  productRecommendations: Pick<
    Product,
    'handle' | 'id' | 'options' | 'title' | 'variants' | 'vendor'
  >[];
};

export default function RelatedProducts({
  colorTheme,
  storefrontProduct,
}: Props) {
  const {countryCode = 'US'} = useSession();
  const {languageCode} = useShop();
  const {data} = useShopQuery<ShopifyPayload>({
    query: QUERY,
    variables: {
      country: countryCode,
      language: languageCode,
      productId: storefrontProduct.id,
    },
  });

  const products = data?.productRecommendations?.slice(0, 4);

  return (
    <div
      className={clsx(
        'rounded-t-xl px-4 py-8', //
        'md:px-8',
      )}
      style={{background: colorTheme?.background || 'white'}}
    >
      <h3
        className={clsx(
          'mb-6 text-lg font-bold', //
          'md:text-xl',
        )}
      >
        Related products
      </h3>
      <div
        className={clsx(
          'grid grid-cols-2 gap-3 pb-overlap', //
          'md:grid-cols-4',
        )}
      >
        {products.map((product) => (
          <ProductCard key={product.id} storefrontProduct={product} />
        ))}
      </div>
    </div>
  );
}

const QUERY = gql`
  query productRecommendations(
    $country: CountryCode
    $language: LanguageCode
    $productId: ID!
  ) @inContext(country: $country, language: $language) {
    productRecommendations(productId: $productId) {
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
            availableForSale
            compareAtPriceV2 {
              currencyCode
              amount
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
              currencyCode
              amount
            }
            selectedOptions {
              name
              value
            }
            title
          }
        }
      }
      vendor
    }
  }
`;
