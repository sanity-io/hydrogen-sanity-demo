import {Image, Money, type ShopifyAnalyticsProduct} from '@shopify/hydrogen';
import clsx from 'clsx';

import Badge from '~/components/elements/Badge';
import {Link} from '~/components/Link';
import AddToCartButton from '~/components/product/buttons/AddToCartButton';
import BuyNowButton from '~/components/product/buttons/BuyNowButton';
import {getProductOptionString, hasMultipleProductOptions} from '~/lib/utils';
import type {ProductWithNodes} from '~/types/shopify';

type Props = {
  imageAspectClassName?: string;
  storefrontProduct: ProductWithNodes;
  variantGid?: string;
};

export default function ProductTooltip({
  imageAspectClassName = 'aspect-square',
  storefrontProduct,
  variantGid,
}: Props) {
  const {handle, options, title, vendor} = storefrontProduct;

  const selectedVariant =
    storefrontProduct.variants.nodes.find(
      (variant) => variant.id == variantGid,
    ) ?? storefrontProduct.variants.nodes[0];

  if (!selectedVariant) {
    return null;
  }

  const multipleProductOptions = hasMultipleProductOptions(options);
  const productOptions = getProductOptionString(options);

  const productAnalytics: ShopifyAnalyticsProduct = {
    productGid: storefrontProduct.id ? storefrontProduct.id : '',
    variantGid: selectedVariant.id,
    name: storefrontProduct.title ? storefrontProduct.title : '',
    variantName: selectedVariant.title,
    brand: storefrontProduct.vendor ? storefrontProduct.vendor : '',
    price: selectedVariant.price.amount,
    quantity: 1,
  };

  return (
    <div className="border-1 relative w-[14rem] rounded border border-gray bg-white p-3">
      <div
        className={clsx([
          imageAspectClassName,
          'relative flex items-center justify-center overflow-hidden rounded bg-lightGray object-cover transition-[border-radius] duration-500 ease-out',
          'hover:rounded-xl',
        ])}
      >
        <Link
          className="absolute left-0 top-0 h-full w-full"
          to={`/products/${handle}`}
        >
          {selectedVariant.image && (
            <Image
              className="absolute h-full w-full transform bg-cover bg-center object-cover object-center ease-in-out"
              data={selectedVariant.image}
              aspectRatio="1/1"
            />
          )}
          {/* Badges */}
          <div className="absolute left-4 top-4">
            {/* Sale */}
            {selectedVariant?.availableForSale &&
              selectedVariant?.compareAtPrice && (
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

        {/* Price */}
        <div className="mt-3 flex font-bold ">
          {selectedVariant.compareAtPrice && (
            <span className="text-darkGray">
              <Money
                data={selectedVariant.compareAtPrice}
                className="mr-2.5 line-through decoration-red"
              />
            </span>
          )}
          {selectedVariant.price && <Money data={selectedVariant.price} />}
        </div>
      </div>

      {/* Button actions */}
      <div className="mt-3 flex gap-2">
        <AddToCartButton
          lines={[
            {
              merchandiseId: selectedVariant.id,
              quantity: 1,
            },
          ]}
          disabled={!selectedVariant.availableForSale}
          analytics={{
            products: [productAnalytics],
            totalValue: parseFloat(productAnalytics.price),
          }}
        />
        <BuyNowButton
          lines={[
            {
              merchandiseId: selectedVariant.id,
              quantity: 1,
            },
          ]}
          disabled={!selectedVariant.availableForSale}
        />
      </div>
    </div>
  );
}
