import {Suspense} from 'react';
import {Image, Link} from '@shopify/hydrogen';

import MoneyCompareAtPrice from './MoneyCompareAtPrice.client';
import MoneyPrice from './MoneyPrice.client';

/**
 * A shared component that displays a single product to allow buyers to quickly identify a particular item of interest
 */
export default function ProductCard({product}) {
  const selectedVariant = product.variants.edges[0].node;

  if (selectedVariant == null) {
    return null;
  }

  return (
    <div className="text-md relative mb-4">
      <Link to={`/products/${product.handle}`}>
        <div className="relative mb-2 flex h-96 items-center justify-center overflow-hidden border border-black object-cover">
          {selectedVariant.image ? (
            <Image
              className="absolute h-full w-full transform bg-cover bg-center object-contain object-center transition-all duration-500 ease-in-out"
              data={selectedVariant.image}
            />
          ) : null}

          {/* Out of stock sticker */}
          {!selectedVariant?.availableForSale && (
            <div className="absolute top-3 left-3 bg-black p-2 text-xs text-white">
              Out of stock
            </div>
          )}
        </div>

        {/* Title */}
        <span className="mb-0.5 font-medium">{product.title}</span>

        {/* Vendor */}
        {product.vendor && <p className="mb-0.5">{product.vendor}</p>}

        <div className="flex ">
          {selectedVariant.compareAtPriceV2 && (
            <Suspense fallback={null}>
              <MoneyCompareAtPrice money={selectedVariant.compareAtPriceV2} />
            </Suspense>
          )}
          <Suspense fallback={null}>
            <MoneyPrice money={selectedVariant.priceV2} />
          </Suspense>
        </div>
      </Link>
    </div>
  );
}
