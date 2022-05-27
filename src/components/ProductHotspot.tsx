import {Link} from '@shopify/hydrogen';
import {Product} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import {Suspense} from 'react';
import MoneyCompareAtPrice from './MoneyCompareAtPrice.client';
import MoneyPrice from './MoneyPrice.client';

type Props = {
  storefrontProduct: Pick<Product, 'handle' | 'title' | 'variants' | 'vendor'>;
};

export default function ProductHotspot({storefrontProduct}: Props) {
  const selectedVariant = storefrontProduct.variants.edges[0].node;

  if (selectedVariant == null) {
    return null;
  }

  return (
    <Link to={`/products/${storefrontProduct.handle}`}>
      <div
        className="min-w-[12.5em] rounded-md border border-lightGray bg-white p-6"
        role="row"
      >
        {/* TODO: potentially DRY with product card */}
        <div className="mr-3 space-y-0.5 overflow-hidden">
          {/* Title */}
          <div className="font-bold">{storefrontProduct.title}</div>

          {/* Vendor */}
          {storefrontProduct.vendor && (
            <div className="text-darkGray">{storefrontProduct.vendor}</div>
          )}
        </div>

        {/* Price / sold out */}
        {selectedVariant?.availableForSale ? (
          <div className="mt-3 flex font-bold">
            {selectedVariant.compareAtPriceV2 && (
              <span className="text-darkGray">
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
          <div className="mt-3 font-bold uppercase text-darkGray">Sold out</div>
        )}
      </div>
    </Link>
  );
}
