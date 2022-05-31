import {Image, Link} from '@shopify/hydrogen';
import {Product} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import {Suspense} from 'react';
import {
  getProductOptionString,
  hasMultipleProductOptions,
} from '../../utils/productOptions';
import Badge from '../Badge';
import MoneyCompareAtPrice from '../MoneyCompareAtPrice.client';
import MoneyPrice from '../MoneyPrice.client';

type Props = {
  onClick: () => void;
  storefrontProduct: Pick<
    Product,
    'handle' | 'options' | 'title' | 'variants' | 'vendor'
  >;
};

/**
 * A shared component that displays a (small) single product to allow buyers to quickly identify a particular item of interest
 */
export default function PillProduct({onClick, storefrontProduct}: Props) {
  const selectedVariant = storefrontProduct.variants.edges[0].node;

  if (selectedVariant == null) {
    return null;
  }

  const multipleProductOptions = hasMultipleProductOptions(
    storefrontProduct.options,
  );
  const productOptions = getProductOptionString(storefrontProduct.options);

  return (
    <Link onClick={onClick} to={`/products/${storefrontProduct.handle}`}>
      <div
        className="group flex h-[110px] gap-4 rounded-md border border-lightGray bg-white p-3 transition-all duration-500 ease-out hover:rounded-xl hover:border-darkGray"
        role="row"
      >
        <div role="cell" className="relative flex-shrink-0">
          <div className="relative h-full w-[110px] overflow-hidden rounded-sm bg-lightGray transition-all duration-500 ease-out group-hover:rounded-md">
            {selectedVariant.image && (
              <Image
                className="absolute inset-0 h-full w-full object-cover"
                data={selectedVariant.image}
                loaderOptions={{width: 100, height: 100, crop: 'center'}}
              />
            )}

            {/* Sale badge */}
            {selectedVariant?.availableForSale &&
              selectedVariant?.compareAtPriceV2 && (
                <Badge label="Sale" small tone="critical" />
              )}

            {/* Sold out badge */}
            {!selectedVariant?.availableForSale && (
              <Badge label="Sold out" small />
            )}
          </div>
        </div>

        {/* TODO: potentially DRY with product card */}
        <div className="overflow-hidden">
          <div className="mr-3 space-y-0.5">
            {/* Title */}
            <div className="truncate font-bold group-hover:underline">
              {storefrontProduct.title}
            </div>

            {/* Vendor */}
            {storefrontProduct.vendor && (
              <div className="truncate text-darkGray">
                {storefrontProduct.vendor}
              </div>
            )}

            {/* Product options */}
            {multipleProductOptions && (
              <div className="truncate text-darkGray">{productOptions}</div>
            )}
          </div>

          {/* Price */}
          <div className="mt-3 flex font-bold ">
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
        </div>
      </div>
    </Link>
  );
}
