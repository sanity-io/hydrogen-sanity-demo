import {gql, useSession, useShop, useShopQuery} from '@shopify/hydrogen';
import {Product} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import {SanityColorTheme} from '../types';
import CardProduct from './cards/CardProduct';

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

// TODO: understand why `useProduct` doesn't work here
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
      className="rounded-t-xl p-8"
      style={{background: colorTheme?.background || 'white'}}
    >
      <h3 className="mb-6 text-xl font-bold">You might also like</h3>
      <div className="grid gap-3 pb-overlap md:grid-cols-4">
        {products.map((product) => (
          <CardProduct key={product.id} storefrontProduct={product} />
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
      vendor
    }
  }
`;
