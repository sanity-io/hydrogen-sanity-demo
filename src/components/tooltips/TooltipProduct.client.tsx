import {Image, Link, useProduct} from '@shopify/hydrogen';
import clsx from 'clsx';
import {Suspense} from 'react';
import {
  getProductOptionString,
  hasMultipleProductOptions,
} from '../../utils/productOptions';
import Badge from '../Badge';
import ButtonSelectedVariantAddToCart from '../buttons/ButtonSelectedVariantAddToCart.client';
import ButtonSelectedVariantBuyNow from '../buttons/ButtonSelectedVariantBuyNow.client';
import MoneyCompareAtPrice from '../MoneyCompareAtPrice.client';
import MoneyPrice from '../MoneyPrice.client';

type Props = {
  imageAspectClassName?: string;
};

/**
 * A shared component that displays a single product to allow buyers to quickly identify a particular item of interest
 */
export default function TooltipProduct({
  imageAspectClassName = 'aspect-square',
}: Props) {
  const {handle, options, selectedVariant, title, vendor} = useProduct();

  if (selectedVariant == null) {
    return null;
  }

  const multipleProductOptions = hasMultipleProductOptions(options);
  const productOptions = getProductOptionString(options);

  return (
    <div className="border-1 relative w-[14rem] rounded border border-gray bg-white p-3">
      <div
        className={clsx([
          imageAspectClassName,
          'relative flex items-center justify-center overflow-hidden rounded bg-lightGray object-cover transition-all duration-500 ease-out',
        ])}
      >
        {selectedVariant.image && (
          <Image
            className="absolute h-full w-full transform bg-cover bg-center object-cover object-center ease-in-out"
            data={selectedVariant.image}
          />
        )}
        {/* Badges */}
        <div className="absolute top-4 left-4">
          {/* Sale */}
          {selectedVariant?.availableForSale &&
            selectedVariant?.compareAtPriceV2 && (
              <Badge label="Sale" tone="critical" />
            )}
          {/* Sold out */}
          {!selectedVariant?.availableForSale && <Badge label="Sold out" />}
        </div>
      </div>

      <div className="mt-3 text-md">
        <div className="space-y-1">
          {/* Title */}
          <Link to={`/products/${handle}`}>
            <div className="font-bold hover:underline">{title}</div>
          </Link>

          {/* Vendor */}
          {vendor && <div className="text-darkGray">{vendor}</div>}

          {/* Product options */}
          {multipleProductOptions && (
            <div className="text-darkGray">{productOptions}</div>
          )}
        </div>

        {/* Price / compare at price */}
        <div className="mt-3 flex font-bold">
          {selectedVariant.compareAtPriceV2 && (
            <span className="text-darkGray">
              <Suspense fallback={null}>
                <MoneyCompareAtPrice money={selectedVariant.compareAtPriceV2} />
              </Suspense>
            </span>
          )}
          <Suspense fallback={null}>
            <MoneyPrice money={selectedVariant.priceV2} />
          </Suspense>
        </div>
      </div>

      {/* Button actions */}
      <div className="mt-3 flex gap-2">
        <ButtonSelectedVariantAddToCart quantity={1} />
        <ButtonSelectedVariantBuyNow quantity={1} />
      </div>
    </div>
  );
}
