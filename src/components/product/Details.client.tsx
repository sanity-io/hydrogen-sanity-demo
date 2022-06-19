import {ProductOptionsProvider} from '@shopify/hydrogen';
import type {ProductVariant} from '@shopify/hydrogen/storefront-api-types';
import clsx from 'clsx';
import type {ProductWithNodes, SanityProductPage} from '../../types';
import ProductGallery from './Gallery.client';
import ProductWidget from './Widget.client';

type Props = {
  initialVariantId?: ProductVariant['id'];
  sanityProduct: SanityProductPage;
  storefrontProduct: ProductWithNodes;
};

export default function ProductDetails({
  initialVariantId,
  sanityProduct,
  storefrontProduct,
}: Props) {
  return (
    <ProductOptionsProvider
      data={storefrontProduct}
      initialVariantId={initialVariantId}
    >
      {/* Gallery */}
      <ProductGallery storefrontProduct={storefrontProduct} />

      {/* Widget (mobile) */}
      <div className="mb-8 lg:hidden">
        <ProductWidget
          sanityProduct={sanityProduct}
          storefrontProduct={storefrontProduct}
        />
      </div>

      {/* Widget (desktop) */}
      <div
        className={clsx(
          'pointer-events-none absolute top-0 right-0 z-10 hidden h-full w-[315px]',
          'lg:block',
        )}
      >
        <div className="sticky top-0 h-screen">
          <div className="absolute bottom-0 w-full p-4">
            <ProductWidget
              sanityProduct={sanityProduct}
              storefrontProduct={storefrontProduct}
            />
          </div>
        </div>
      </div>
    </ProductOptionsProvider>
  );
}
