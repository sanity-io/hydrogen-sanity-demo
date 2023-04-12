import {Product, ProductVariant} from '@shopify/hydrogen/storefront-api-types';
import {AppLoadContext} from '@shopify/remix-oxygen';

import {
  PRODUCT_AND_VARIANT,
  PRODUCTS_AND_VARIANTS,
} from '~/queries/shopify/product';
import {
  SanityImageWithProductHotspots,
  SanityProductWithVariant,
} from '~/types/sanity';
import {ProductWithNodes} from '~/types/shopify';

type ShopifyPayload = {
  products: Partial<Product>[];
  productVariants: Partial<ProductVariant>[];
};

export const getHeroData = async ({
  content,
  context,
}: {
  content: SanityImageWithProductHotspots | SanityProductWithVariant;
  context: AppLoadContext;
}) => {
  switch (content._type) {
    case 'imageWithProductHotspots':
      {
        let storefrontProducts: ProductWithNodes[];
        if (content.productHotspots) {
          const [productGids, productVariantGids] =
            content.productHotspots.reduce<[string[], string[]]>(
              (acc, val) => {
                if (val.product) {
                  acc[0].push(val.product.gid);
                  acc[1].push(val.product.variantGid);
                }
                return acc;
              },
              [[], []],
            );

          const {products, productVariants}: ShopifyPayload =
            await context.storefront.query(PRODUCTS_AND_VARIANTS, {
              variables: {
                ids: productGids,
                variantIds: productVariantGids,
              },
            });

          // Attach variant nodes
          storefrontProducts = products.map((product, index) => {
            const productVariant = productVariants[index];
            return {
              ...product,
              variants: {nodes: [productVariant as ProductVariant]},
            };
          });

          return storefrontProducts;
        }
      }
      break;
    case 'productWithVariant': {
    }
  }
};
