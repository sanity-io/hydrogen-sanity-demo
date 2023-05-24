import {
  type ShopifyAnalyticsPayload,
  type ShopifyAnalyticsProduct,
} from '@shopify/hydrogen';
import type {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';
import invariant from 'tiny-invariant';

import AddToCartButton from '~/components/product/buttons/AddToCartButton';
import BuyNowButton from '~/components/product/buttons/BuyNowButton';
import ProductOptions from '~/components/product/Options';
import type {SanityCustomProductOption} from '~/lib/sanity';
import {hasMultipleProductOptions} from '~/lib/utils';

export default function ProductForm({
  product,
  selectedVariant,
  analytics,
  customProductOptions,
}: {
  product: Product;
  selectedVariant: ProductVariant;
  analytics: ShopifyAnalyticsPayload;
  customProductOptions?: SanityCustomProductOption[];
}) {
  const isOutOfStock = !selectedVariant?.availableForSale;

  const multipleProductOptions = hasMultipleProductOptions(product.options);

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
      {multipleProductOptions && (
        <>
          <ProductOptions
            options={product.options}
            selectedVariant={selectedVariant}
            customProductOptions={customProductOptions}
          />
          <div className="my-4 w-full border-b border-gray" />
        </>
      )}

      <div className="flex flex-col space-y-2">
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
          buttonClassName="w-full"
        />
        <BuyNowButton
          lines={[{merchandiseId: selectedVariant.id, quantity: 1}]}
          disabled={isOutOfStock}
        />
      </div>
    </>
  );
}
