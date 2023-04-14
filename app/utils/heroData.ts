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

type ShopifyHotspotPayload = {
  products: Partial<Product>[];
  productVariants: Partial<ProductVariant>[];
};

type ShopifyProductPayload = {
  product: Partial<Product>;
  productVariant: Partial<ProductVariant>;
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

          const {products, productVariants}: ShopifyHotspotPayload =
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
      let storefrontProduct;
      const {gid, variantGid} = content;

      if (gid && variantGid) {
        const {product, productVariant}: ShopifyProductPayload =
          await context.storefront.query(PRODUCT_AND_VARIANT, {
            variables: {
              id: gid,
              variantId: variantGid,
            },
          });

        // Attach variant nodes
        storefrontProduct = {
          ...product,
          variants: {nodes: [productVariant as ProductVariant]},
        };
      }

      return storefrontProduct;
    }
  }
};
