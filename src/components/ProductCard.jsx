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
    <div className="text-md mb-4 relative">
      <Link to={`/products/${product.handle}`}>
        <div className="border border-black mb-2 relative flex items-center justify-center overflow-hidden object-cover h-96">
          {selectedVariant.image ? (
            <Image
              className="absolute w-full h-full transition-all duration-500 ease-in-out transform bg-center bg-cover object-center object-contain"
              data={selectedVariant.image}
            />
          ) : null}

          {/* Out of stock sticker */}
          {!selectedVariant?.availableForSale && (
            <div className="absolute top-3 left-3 text-xs bg-black text-white p-2">
              Out of stock
            </div>
          )}
        </div>

        {/* Title */}
        <span className="font-medium mb-0.5">{product.title}</span>

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
