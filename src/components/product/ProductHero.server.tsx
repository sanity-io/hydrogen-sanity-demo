import {gql, Image, useLocalization, useShopQuery} from '@shopify/hydrogen';
import type {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';
import {PRODUCT_FIELDS} from '../../fragments/shopify/product';
import {PRODUCT_VARIANT_FIELDS} from '../../fragments/shopify/productVariant';
import ProductTile from './Tile';

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
    const {
      language: {isoCode: languageCode},
      country: {isoCode: countryCode},
    } = useLocalization();
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
        <ProductTile storefrontProduct={storefrontProduct} />
      </div>
    </>
  );
}

const QUERY_SHOPIFY = gql`
  ${PRODUCT_FIELDS}
  ${PRODUCT_VARIANT_FIELDS}

  query product(
    $country: CountryCode
    $language: LanguageCode
    $id: ID!
    $variantId: ID!
  ) @inContext(country: $country, language: $language) {
    product: product(id: $id) {
      ...ProductFields
    }
    productVariant: node(id: $variantId) {
      ... on ProductVariant {
        ...ProductVariantFields
      }
    }
  }
`;
