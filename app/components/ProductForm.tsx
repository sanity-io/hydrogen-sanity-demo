import {
  Money,
  type ShopifyAnalyticsPayload,
  type ShopifyAnalyticsProduct,
} from '@shopify/hydrogen';
import type {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';
import invariant from 'tiny-invariant';

import AddToCartButton from '~/components/product/buttons/AddToCartButton';
import ProductOptions from '~/components/ProductOptions';

export default function ProductGrid({
  product,
  selectedVariant,
  analytics,
}: {
  product: Product;
  selectedVariant: ProductVariant;
  analytics: ShopifyAnalyticsPayload;
}) {
  const isOutOfStock = !selectedVariant?.availableForSale;
  const isOnSale =
    selectedVariant?.price?.amount &&
    selectedVariant?.compareAtPrice?.amount &&
    selectedVariant?.price?.amount < selectedVariant?.compareAtPrice?.amount;

  invariant(
    analytics?.products?.[0],
    'Missing product analytics data for product page',
  );

  const productAnalytics: ShopifyAnalyticsProduct = {
    ...analytics.products[0],
    quantity: 1,
  };

  return (
    <>
      <ProductOptions
        options={product.options}
        selectedVariant={selectedVariant}
      />
      <AddToCartButton
        lines={[
          {
            merchandiseId: selectedVariant.id,
            quantity: 1,
          },
        ]}
        disabled={isOutOfStock}
        analytics={{
          products: [productAnalytics],
          totalValue: parseFloat(productAnalytics.price),
        }}
      >
        {isOutOfStock ? (
          <span>Sold out</span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <span>Add to Bag</span> <span>·</span>{' '}
            <Money
              withoutTrailingZeros
              data={selectedVariant?.price!}
              as="span"
            />
            {isOnSale && (
              <Money
                withoutTrailingZeros
                data={selectedVariant?.compareAtPrice!}
                as="s"
                className="strike opacity-50"
              />
            )}
          </span>
        )}
      </AddToCartButton>
      {/* TODO: Shop Pay button */}
    </>
  );
}
