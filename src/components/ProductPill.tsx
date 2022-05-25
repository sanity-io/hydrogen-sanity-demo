import {Image, Link} from '@shopify/hydrogen';
import {Product} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import {Suspense} from 'react';
import MoneyCompareAtPrice from './MoneyCompareAtPrice.client';
import MoneyPrice from './MoneyPrice.client';

type Props = {
  storefrontProduct: Product;
};

/**
 * A shared component that displays a (small) single product to allow buyers to quickly identify a particular item of interest
 */
export default function ProductPill({storefrontProduct}: Props) {
  const selectedVariant = storefrontProduct.variants.edges[0].node;

  if (selectedVariant == null) {
    return null;
  }

  return (
    <Link to={`/products/${storefrontProduct.handle}`}>
      <div className="flex" role="row">
        <div role="cell" className="relative mr-4 flex-shrink-0">
          <div className="relative h-20 w-20 overflow-hidden rounded bg-gray">
            {selectedVariant.image && (
              <Image
                className="absolute inset-0 object-cover"
                data={selectedVariant.image}
                loaderOptions={{width: 100, height: 100, crop: 'center'}}
              />
            )}
          </div>

          {/* Out of stock sticker */}
          {!selectedVariant?.availableForSale && (
            <div className="absolute top-0 left-0 bg-black p-2 text-xs text-white">
              Out of stock
            </div>
          )}
        </div>

        <div className="truncate">
          {/* Title */}
          <span className="mb-0.5 text-sm font-bold uppercase">
            {storefrontProduct.title}
          </span>

          {/* Vendor */}
          {storefrontProduct.vendor && (
            <p className="mb-0.5 text-sm">{storefrontProduct.vendor}</p>
          )}

          <div className="flex text-xs">
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
    </Link>
  );
}
