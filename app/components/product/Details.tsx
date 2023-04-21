import {ShopifyAnalyticsPayload} from '@shopify/hydrogen';
import type {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';
import clsx from 'clsx';

import ProductGallery from '~/components/product/Gallery';
import ProductWidget from '~/components/product/Widget';
import type {SanityProductPage} from '~/lib/sanity';

type Props = {
  sanityProduct: SanityProductPage;
  storefrontProduct: Product;
  selectedVariant: ProductVariant;
  analytics: ShopifyAnalyticsPayload;
};

export default function ProductDetails({
  sanityProduct,
  storefrontProduct,
  selectedVariant,
  analytics,
}: Props) {
  return (
    <>
      {/* Gallery */}
      <ProductGallery
        storefrontProduct={storefrontProduct}
        selectedVariant={selectedVariant}
      />

      {/* Widget (mobile) */}
      <div className="mb-8 lg:hidden">
        <ProductWidget
          sanityProduct={sanityProduct}
          storefrontProduct={storefrontProduct}
          selectedVariant={selectedVariant}
          analytics={analytics}
        />
      </div>

      {/* Widget (desktop) */}
      <div
        className={clsx(
          'pointer-events-none absolute right-0 top-0 z-10 hidden h-full w-[315px]',
          'lg:block',
        )}
      >
        <div className="sticky top-0 h-screen">
          <div className="absolute bottom-0 w-full p-4">
            <ProductWidget
              sanityProduct={sanityProduct}
              storefrontProduct={storefrontProduct}
              selectedVariant={selectedVariant}
              analytics={analytics}
            />
          </div>
        </div>
      </div>
    </>
  );
}
