import {Suspense} from 'react';
import {Image, Link} from '@shopify/hydrogen';

import MoneyCompareAtPrice from './MoneyCompareAtPrice.client';
import MoneyPrice from './MoneyPrice.client';

/**
 * A shared component that displays a (small) single product to allow buyers to quickly identify a particular item of interest
 */
export default function ProductPill({product}) {
  const selectedVariant = product.variants.edges[0].node;

  if (selectedVariant == null) {
    return null;
  }

  return (
    <div className="flex" role="row">
      <div role="cell" className="mr-4 flex-shrink-0">
        {selectedVariant.image ? (
          <Image
            data={selectedVariant.image}
            loaderOptions={{width: 98, height: 98, crop: 'center'}}
          />
        ) : null}

        {/* Out of stock sticker */}
        {!selectedVariant?.availableForSale && (
          <div className="absolute top-3 left-3 bg-black p-2 text-xs text-white">
            Out of stock
          </div>
        )}
      </div>

      <div>
        {/* Title */}
        <span className="mb-0.5 text-sm font-medium">{product.title}</span>

        {/* Vendor */}
        {product.vendor && <p className="mb-0.5 text-sm">{product.vendor}</p>}

        <div className="flex text-sm">
          {selectedVariant.compareAtPriceV2 && (
            <Suspense fallback={null}>
              <MoneyCompareAtPrice money={selectedVariant.compareAtPriceV2} />
            </Suspense>
          )}
          <Suspense fallback={null}>
            <MoneyPrice money={selectedVariant.priceV2} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
