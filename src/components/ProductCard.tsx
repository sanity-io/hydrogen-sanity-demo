import {Image, Link} from '@shopify/hydrogen';
import {Product} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import {Suspense} from 'react';
import MoneyCompareAtPrice from './MoneyCompareAtPrice.client';
import MoneyPrice from './MoneyPrice.client';

type Props = {
  storefrontProduct: Product;
};

/**
 * A shared component that displays a single product to allow buyers to quickly identify a particular item of interest
 */
export default function ProductCard({storefrontProduct}: Props) {
  const selectedVariant = storefrontProduct.variants.edges[0].node;

  if (selectedVariant == null) {
    return null;
  }

  return (
    <div
      className="relative mb-4"
      // style={{
      //   color: 'red',
      // }}
    >
      <Link to={`/products/${storefrontProduct.handle}`}>
        <div className="relative mb-2 flex aspect-square items-center justify-center overflow-hidden rounded bg-gray-50 object-cover">
          {selectedVariant.image ? (
            <Image
              className="absolute h-full w-full transform bg-cover bg-center object-cover object-center transition-all duration-500 ease-in-out"
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
        <span className="text-md mb-0.5 font-bold uppercase">
          {storefrontProduct.title}
        </span>

        {/* Vendor */}
        {storefrontProduct.vendor && (
          <p className="mb-0.5 text-sm">{storefrontProduct.vendor}</p>
        )}

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
      </Link>
    </div>
  );
}
