import {gql, useSession, useShop, useShopQuery} from '@shopify/hydrogen';
import type {Product} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import clsx from 'clsx';
import type {ProductWithNodes, SanityColorTheme} from '../../types';
import ProductCard from './Card.server';

type Props = {
  colorTheme?: SanityColorTheme;
  storefrontProduct: Partial<Product>;
};

type ShopifyPayload = {
  productRecommendations: ProductWithNodes[];
};

export default function RelatedProducts({
  colorTheme,
  storefrontProduct,
}: Props) {
  const {countryCode = 'US'} = useSession();
  const {languageCode} = useShop();
  const {data} = useShopQuery<ShopifyPayload>({
    query: QUERY_SHOPIFY,
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

const QUERY_SHOPIFY = gql`
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
        nodes {
          availableForSale
          compareAtPriceV2 {
            currencyCode
            amount
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
      vendor
    }
  }
`;
