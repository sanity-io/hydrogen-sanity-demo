import {gql, useShopQuery} from '@shopify/hydrogen';
import {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import sanityConfig from '../../../sanity.config';
import type {
  ProductWithNodes,
  SanityImageWithProductHotspots,
} from '../../types';
import ProductHotspot from '../product/Hotspot.client';
import SanityImage from './SanityImage.client';

type Props = {
  content: SanityImageWithProductHotspots;
};

type ShopifyPayload = {
  products: Partial<Product>[];
  productVariants: Partial<ProductVariant>[];
};

export default function ImageWithProductHotspots({content}: Props) {
  // Conditionally Fetch Shopify products
  let storefrontProducts: ProductWithNodes[];
  if (content.productHotspots) {
    const [productGids, productVariantGids] = content.productHotspots.reduce<
      [string[], string[]]
    >(
      (acc, val) => {
        if (val.product) {
          acc[0].push(val.product.gid);
          acc[1].push(val.product.variantGid);
        }
        return acc;
      },
      [[], []],
    );

    const {data} = useShopQuery<ShopifyPayload>({
      query: QUERY_SHOPIFY,
      variables: {
        ids: productGids,
        variantIds: productVariantGids,
      },
    });
    // Attach variant nodes
    storefrontProducts = data.products.map((product, index) => {
      const productVariant = data.productVariants[index];
      return {
        ...product,
        variants: {nodes: [productVariant as ProductVariant]},
      };
    });
  }

  return (
    <>
      {content.productHotspots?.map((hotspot, index) => (
        <ProductHotspot
          key={hotspot._key}
          storefrontProduct={storefrontProducts[index]}
          x={hotspot.x}
          y={hotspot.y}
        />
      ))}

      <SanityImage
        alt={content?.image?.altText}
        crop={content?.image?.crop}
        dataset={sanityConfig.dataset}
        hotspot={content?.image?.hotspot}
        layout="responsive"
        objectFit="cover"
        projectId={sanityConfig.projectId}
        sizes="100vw"
        src={content?.image?.asset._ref}
      />
    </>
  );
}

const QUERY_SHOPIFY = gql`
  query products(
    $country: CountryCode
    $language: LanguageCode
    $ids: [ID!]!
    $variantIds: [ID!]!
  ) @inContext(country: $country, language: $language) {
    products: nodes(ids: $ids) {
      ... on Product {
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
          }
        }
        vendor
      }
    }
    productVariants: nodes(ids: $variantIds) {
      ... on ProductVariant {
        availableForSale
        compareAtPriceV2 {
          amount
          currencyCode
        }
        id
        priceV2 {
          amount
          currencyCode
        }
        selectedOptions {
          name
          value
        }
        title
      }
    }
  }
`;
