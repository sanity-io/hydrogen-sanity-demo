import {Image, Link} from '@shopify/hydrogen';
import {Product} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import {Suspense} from 'react';
import MoneyCompareAtPrice from './MoneyCompareAtPrice.client';
import MoneyPrice from './MoneyPrice.client';

type Props = {
  storefrontProduct: Pick<Product, 'handle' | 'title' | 'variants' | 'vendor'>;
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
      <div
        className="flex h-[110px] gap-4 rounded-md border border-lightGray bg-white p-3"
        role="row"
      >
        <div role="cell" className="relative flex-shrink-0">
          <div className="relative aspect-[107/84] h-full overflow-hidden rounded-sm bg-lightGray">
            {selectedVariant.image && (
              <Image
                className="absolute inset-0 h-full w-full object-cover"
                data={selectedVariant.image}
                loaderOptions={{width: 100, height: 100, crop: 'center'}}
              />
            )}
          </div>

          {/* Out of stock sticker */}
          {/*!selectedVariant?.availableForSale && (
            <div className="absolute top-0 left-0 bg-black p-2 text-xs text-white">
              Out of stock
            </div>
          )*/}
        </div>

        {/* TODO: potentially DRY with product card */}
        <div>
          <div className="mr-3 space-y-0.5 overflow-hidden">
            {/* Title */}
            <div className="font-bold">{storefrontProduct.title}</div>

            {/* Vendor */}
            {storefrontProduct.vendor && (
              <div className="text-gray">{storefrontProduct.vendor}</div>
            )}
          </div>

          {/* Price / sold out */}
          {selectedVariant?.availableForSale ? (
            <div className="mt-3 flex font-bold">
              {selectedVariant.compareAtPriceV2 && (
                <span className="text-gray">
                  <Suspense fallback={null}>
                    <MoneyCompareAtPrice
                      money={selectedVariant.compareAtPriceV2}
                    />
                  </Suspense>
                </span>
              )}
              <Suspense fallback={null}>
                <MoneyPrice money={selectedVariant.priceV2} />
              </Suspense>
            </div>
          ) : (
            <div className="mt-3 font-bold uppercase text-gray">Sold out</div>
          )}
        </div>
      </div>
    </Link>
  );
}
