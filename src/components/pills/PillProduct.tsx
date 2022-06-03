import {Image, Link} from '@shopify/hydrogen';
import {Product} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import clsx from 'clsx';
import {Suspense} from 'react';
import {
  getProductOptionString,
  hasMultipleProductOptions,
} from '../../utils/productOptions';
import Badge from '../Badge';
import MoneyCompareAtPrice from '../MoneyCompareAtPrice.client';
import MoneyPrice from '../MoneyPrice.client';

type Props = {
  onClick?: () => void;
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
  const {availableForSale, compareAtPriceV2, image, priceV2} = selectedVariant;

  return (
    <Link onClick={onClick} to={`/products/${storefrontProduct.handle}`}>
      <div
        className="group flex h-[108px] gap-4 rounded-md border border-lightGray bg-white p-3 text-sm transition-all duration-500 ease-out hover:rounded-lg hover:border-darkGray"
        role="row"
      >
        <div role="cell" className="relative flex-shrink-0">
          <div className="relative h-full w-[110px] overflow-hidden rounded-sm bg-lightGray transition-all duration-500 ease-out group-hover:rounded-md">
            {image && (
              <Image
                className={clsx(
                  'absolute inset-0 h-full w-full object-cover',
                  !availableForSale && 'opacity-50',
                )}
                data={image}
                loaderOptions={{width: 100, height: 100, crop: 'center'}}
              />
            )}

            {/* Badges */}
            <div className="absolute top-2 left-2">
              {/* Sale */}
              {availableForSale && compareAtPriceV2 && (
                <Badge label="Sale" small tone="critical" />
              )}

              {/* Sold out */}
              {!availableForSale && <Badge label="Sold out" small />}
            </div>
          </div>
        </div>

        {/* TODO: potentially DRY with product card */}
        <div className="overflow-hidden">
          <div className="mr-3 space-y-1">
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
            {compareAtPriceV2 && (
              <span className="text-darkGray">
                <Suspense fallback={null}>
                  <MoneyCompareAtPrice money={compareAtPriceV2} />
                </Suspense>
              </span>
            )}
            <Suspense fallback={null}>
              <MoneyPrice money={priceV2} />
            </Suspense>
          </div>
        </div>
      </div>
    </Link>
  );
}
