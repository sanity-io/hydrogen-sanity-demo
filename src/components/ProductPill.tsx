import {Image, Link} from '@shopify/hydrogen';
import {Product} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import pluralize from 'pluralize';
import {Suspense} from 'react';
import MoneyCompareAtPrice from './MoneyCompareAtPrice.client';
import MoneyPrice from './MoneyPrice.client';

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
export default function ProductPill({onClick, storefrontProduct}: Props) {
  const selectedVariant = storefrontProduct.variants.edges[0].node;

  if (selectedVariant == null) {
    return null;
  }

  // TODO: DRY with product card
  const firstOption = storefrontProduct.options[0];
  const hasDefaultVariantOnly =
    firstOption.name === 'Title' && firstOption.values[0] === 'Default Title';
  const productOptions = storefrontProduct.options
    ?.map(({name, values}) => pluralize(name, values.length, true))
    .join(' / ');

  return (
    <Link onClick={onClick} to={`/products/${storefrontProduct.handle}`}>
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
        <div className="overflow-hidden">
          <div className="mr-3 space-y-0.5">
            {/* Title */}
            <div className="truncate font-bold">{storefrontProduct.title}</div>

            {/* Vendor */}
            {storefrontProduct.vendor && (
              <div className="truncate text-darkGray">
                {storefrontProduct.vendor}
              </div>
            )}

            {/* Product options */}
            {!hasDefaultVariantOnly && (
              <div className="truncate text-darkGray">{productOptions}</div>
            )}
          </div>

          {/* Price / sold out */}
          {selectedVariant?.availableForSale ? (
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
          ) : (
            <div className="mt-3 font-bold uppercase text-darkGray">
              Sold out
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
