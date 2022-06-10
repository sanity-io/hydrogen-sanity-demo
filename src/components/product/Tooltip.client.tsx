import {Image, Link, useProduct} from '@shopify/hydrogen';
import clsx from 'clsx';
import {Suspense} from 'react';
import {
  getProductOptionString,
  hasMultipleProductOptions,
} from '../../utils/productOptions';
import Badge from '../Badge';
import SelectedVariantAddToCartButton from '../buttons/SelectedVariantAddToCart.client';
import SelectedVariantBuyNowButton from '../buttons/SelectedVariantBuyNow.client';
import MoneyCompareAtPrice from '../money/CompareAtPrice.client';
import MoneyPrice from '../money/Price.client';

type Props = {
  imageAspectClassName?: string;
};

export default function ProductTooltip({
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
          'relative flex items-center justify-center overflow-hidden rounded bg-lightGray object-cover duration-500 ease-out',
          'hover:rounded-xl',
        ])}
      >
        <Link
          className="absolute top-0 left-0 h-full w-full"
          to={`/products/${handle}`}
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
        </Link>
      </div>

      <div className="mt-3 text-md">
        <div className="space-y-1">
          {/* Title */}
          <Link
            className="font-bold hover:underline"
            to={`/products/${handle}`}
          >
            {title}
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
        <SelectedVariantAddToCartButton quantity={1} />
        <SelectedVariantBuyNowButton quantity={1} />
      </div>
    </div>
  );
}
