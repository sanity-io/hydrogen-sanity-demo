import {useSession, useShop, useShopQuery} from '@shopify/hydrogen';
import {Product} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import gql from 'graphql-tag';
import DebugWrapper from './DebugWrapper';
import ProductCard from './ProductCard';

type Props = {
  storefrontProduct: Product;
};

type ShopifyPayload = {
  data: {
    productRecommendations: Product[];
  };
};

// TODO: understand why `useProduct` doesn't work here
export default function RelatedProducts({storefrontProduct}: Props) {
  const {countryCode = 'US'} = useSession();
  const {languageCode} = useShop();
  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      country: countryCode,
      language: languageCode,
      productId: storefrontProduct.id,
    },
  }) as ShopifyPayload;

  const products = data?.productRecommendations?.slice(0, 4);

  return (
    <DebugWrapper name="Related products" shopify>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} storefrontProduct={product} />
        ))}
      </div>
    </DebugWrapper>
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
      title
      variants(first: 1) {
        edges {
          node {
            id
            title
            availableForSale
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
            compareAtPriceV2 {
              currencyCode
              amount
            }
          }
        }
      }
    }
  }
`;
