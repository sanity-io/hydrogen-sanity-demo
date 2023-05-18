import {Image, Money, type ShopifyAnalyticsProduct} from '@shopify/hydrogen';
import type {ProductVariant} from '@shopify/hydrogen/storefront-api-types';
import clsx from 'clsx';

import Badge from '~/components/elements/Badge';
import {Link} from '~/components/Link';
import AddToCartButton from '~/components/product/buttons/AddToCartButton';
import {
  getProductOptionString,
  hasMultipleProductOptions,
  useGid,
} from '~/lib/utils';
import type {ProductWithNodes} from '~/types/shopify';

type Props = {
  imageAspectClassName?: string;
  storefrontProduct: ProductWithNodes;
  variantGid?: string;
};

export default function ProductCard({
  imageAspectClassName = 'aspect-square',
  storefrontProduct,
  variantGid,
}: Props) {
  const firstVariant =
    useGid<ProductVariant>(variantGid) ??
    storefrontProduct.variants.nodes.find(
      (variant) => variant.id == variantGid,
    ) ??
    storefrontProduct.variants.nodes[0];

  if (firstVariant == null) {
    return null;
  }

  const multipleProductOptions = hasMultipleProductOptions(
    storefrontProduct.options,
  );
  const productOptions = getProductOptionString(storefrontProduct.options);

  const productAnalytics: ShopifyAnalyticsProduct = {
    productGid: storefrontProduct.id ? storefrontProduct.id : '',
    variantGid: firstVariant.id,
    name: storefrontProduct.title ? storefrontProduct.title : '',
    variantName: firstVariant.title,
    brand: storefrontProduct.vendor ? storefrontProduct.vendor : '',
    price: firstVariant.price.amount,
    quantity: 1,
  };

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
          className="absolute left-0 top-0 h-full w-full"
          to={`/products/${storefrontProduct.handle}`}
        >
          {firstVariant.image && (
            <Image
              className="absolute h-full w-full transform bg-cover bg-center object-cover object-center ease-in-out"
              data={firstVariant.image}
              crop="center"
              sizes="100%"
            />
          )}

          {/* Badges */}
          <div className="absolute left-4 top-4">
            {/* Sale */}
            {firstVariant?.availableForSale && firstVariant?.compareAtPrice && (
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
            <AddToCartButton
              lines={[
                {
                  merchandiseId: firstVariant.id,
                  quantity: 1,
                },
              ]}
              disabled={!firstVariant.availableForSale}
              analytics={{
                products: [productAnalytics],
                totalValue: parseFloat(productAnalytics.price),
              }}
            >
              Quick add
            </AddToCartButton>
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
          {firstVariant.compareAtPrice && (
            <span className="text-darkGray">
              <Money
                data={firstVariant.compareAtPrice}
                className="mr-2.5 line-through decoration-red"
              />
            </span>
          )}
          {firstVariant.price && <Money data={firstVariant.price} />}
        </div>
      </div>
    </div>
  );
}
