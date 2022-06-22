import {gql, useLocalization, useShopQuery} from '@shopify/hydrogen';
import clsx from 'clsx';
import {PRODUCT_FIELDS} from '../../fragments/shopify/product';
import {PRODUCT_VARIANT_FIELDS} from '../../fragments/shopify/productVariant';
import type {ProductWithNodes, SanityColorTheme} from '../../types';
import ProductCard from './Card.server';

type Props = {
  colorTheme?: SanityColorTheme;
  storefrontProduct: ProductWithNodes;
};

type ShopifyPayload = {
  productRecommendations: ProductWithNodes[];
};

export default function RelatedProducts({
  colorTheme,
  storefrontProduct,
}: Props) {
  const {
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();
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
          'grid grid-cols-2 gap-3 pb-6', //
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
  ${PRODUCT_FIELDS}
  ${PRODUCT_VARIANT_FIELDS}

  query productRecommendations(
    $country: CountryCode
    $language: LanguageCode
    $productId: ID!
  ) @inContext(country: $country, language: $language) {
    productRecommendations(productId: $productId) {
      ...ProductFields
      variants(first: 1) {
        nodes {
          ...ProductVariantFields
        }
      }
    }
  }
`;
