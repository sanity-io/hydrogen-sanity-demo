import {Image, Link} from '@shopify/hydrogen';
import clsx from 'clsx';
import {Suspense} from 'react';
import type {ProductWithNodes} from '../../types';
import {
  getProductOptionString,
  hasMultipleProductOptions,
} from '../../utils/productOptions';
import Badge from '../elements/Badge';
import SelectedVariantAddToCartButton from './buttons/SelectedVariantAddToCart.client';
import MoneyCompareAtPrice from './money/CompareAtPrice.client';
import MoneyPrice from './money/Price.client';
import ProductOptionsWrapper from '../ProductOptionsWrapper.client';

type Props = {
  imageAspectClassName?: string;
  storefrontProduct: ProductWithNodes;
};

export default function ProductCard({
  imageAspectClassName = 'aspect-square',
  storefrontProduct,
}: Props) {
  const firstVariant = storefrontProduct.variants.nodes[0];

  if (firstVariant == null) {
    return null;
  }

  const multipleProductOptions = hasMultipleProductOptions(
    storefrontProduct.options,
  );
  const productOptions = getProductOptionString(storefrontProduct.options);

  return (
    <div className="group relative">
      <div
        className={clsx([
          imageAspectClassName,
          'relative flex items-center justify-center overflow-hidden rounded bg-lightGray object-cover transition-[border-radius] duration-500 ease-out',
          'hover:rounded-xl',
        ])}
      >
        <Link
          className="absolute top-0 left-0 h-full w-full"
          to={`/products/${storefrontProduct.handle}`}
        >
          {firstVariant.image && (
            <Image
              className="absolute h-full w-full transform bg-cover bg-center object-cover object-center ease-in-out"
              data={firstVariant.image}
              loaderOptions={{crop: 'center'}}
            />
          )}

          {/* Badges */}
          <div className="absolute top-4 left-4">
            {/* Sale */}
            {firstVariant?.availableForSale &&
              firstVariant?.compareAtPriceV2 && (
                <Badge label="Sale" tone="critical" />
              )}
            {/* Sold out */}
            {!firstVariant?.availableForSale && <Badge label="Sold out" />}
          </div>
        </Link>

        {/* Quick add to cart */}
        {firstVariant.availableForSale && (
          <div
            className={clsx(
              'absolute bottom-0 right-4 translate-y-full pb-4 duration-200 ease-in-out',
              'group-hover:block group-hover:translate-y-0',
            )}
          >
            {/* 
            Use <ProductOptionsWrapper /> as an escape hatch to wrap our add to cart button
            within a <ProductOptionsProvider /> (required for the button to work correctly).
            */}
            <ProductOptionsWrapper data={storefrontProduct}>
              <SelectedVariantAddToCartButton label="Quick add" />
            </ProductOptionsWrapper>
          </div>
        )}
      </div>

      <div className="mt-3 text-md">
        <div className="space-y-1">
          {/* Title */}
          <Link
            className={clsx(
              'font-bold', //
              'hover:underline',
            )}
            to={`/products/${storefrontProduct.handle}`}
          >
            {storefrontProduct.title}
          </Link>

          {/* Vendor */}
          {storefrontProduct.vendor && (
            <div className="text-darkGray">{storefrontProduct.vendor}</div>
          )}

          {/* Product options */}
          {multipleProductOptions && (
            <div className="text-darkGray">{productOptions}</div>
          )}
        </div>

        {/* Price / compare at price */}
        <div className="mt-3 flex font-bold">
          {firstVariant.compareAtPriceV2 && (
            <span className="text-darkGray">
              <Suspense fallback={null}>
                <MoneyCompareAtPrice money={firstVariant.compareAtPriceV2} />
              </Suspense>
            </span>
          )}
          <Suspense fallback={null}>
            <MoneyPrice money={firstVariant.priceV2} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
