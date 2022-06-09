import {Image, Link, ProductProvider} from '@shopify/hydrogen';
import {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import clsx from 'clsx';
import {Suspense} from 'react';
import {
  getProductOptionString,
  hasMultipleProductOptions,
} from '../../utils/productOptions';
import Badge from '../Badge';
import ButtonSelectedVariantAddToCart from '../buttons/ButtonSelectedVariantAddToCart.client';
import MoneyCompareAtPrice from '../MoneyCompareAtPrice.client';
import MoneyPrice from '../MoneyPrice.client';

/**
 * A shared component that displays a single product to allow buyers to quickly identify a particular item of interest
 */

type Props = {
  imageAspectClassName?: string;
  storefrontProduct: Pick<
    Product,
    'handle' | 'options' | 'title' | 'variants' | 'vendor'
  >;
  storefrontProductVariant?: Pick<
    ProductVariant,
    | 'availableForSale'
    | 'compareAtPriceV2'
    | 'id'
    | 'image'
    | 'priceV2'
    | 'selectedOptions'
    | 'title'
  >;
};

export default function CardProduct({
  imageAspectClassName = 'aspect-square',
  storefrontProduct,
  storefrontProductVariant,
}: Props) {
  // TODO: Refactor
  const storefrontProductWithVariant = {
    ...storefrontProduct,
    ...(storefrontProductVariant
      ? {variants: {edges: [{node: storefrontProductVariant}]}}
      : {}),
  };

  const selectedVariant =
    storefrontProductVariant || storefrontProduct.variants.edges[0].node;

  if (selectedVariant == null) {
    return null;
  }

  const multipleProductOptions = hasMultipleProductOptions(
    storefrontProduct.options,
  );
  const productOptions = getProductOptionString(storefrontProduct.options);

  return (
    <ProductProvider
      data={storefrontProductWithVariant}
      initialVariantId={selectedVariant.id}
    >
      <div className="group relative">
        <div
          className={clsx([
            imageAspectClassName,
            'relative flex items-center justify-center overflow-hidden rounded bg-lightGray object-cover duration-500 ease-out',
            'hover:rounded-xl',
          ])}
        >
          <Link
            className="absolute top-0 left-0 h-full w-full"
            to={`/products/${storefrontProduct.handle}`}
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

          {/* Quick add to cart */}
          {selectedVariant.availableForSale && (
            <div
              className={clsx(
                'absolute bottom-0 right-4 translate-y-full pb-4 duration-200 ease-in-out',
                'group-hover:block group-hover:translate-y-0',
              )}
            >
              <ButtonSelectedVariantAddToCart label="Quick add" />
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
    </ProductProvider>
  );
}
