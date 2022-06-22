import {Link, ProductOptionsProvider} from '@shopify/hydrogen';
import type {ProductVariant} from '@shopify/hydrogen/storefront-api-types';
// @ts-expect-error incompatibility with node16 resolution
import Tippy from '@tippyjs/react/headless';
import clsx from 'clsx';
import type {ProductWithNodes} from '../../types';
import ProductTooltip from './Tooltip.client';

type Props = {
  initialVariantId?: ProductVariant['id'];
  storefrontProduct: ProductWithNodes;
};

export default function ProductTag({
  initialVariantId,
  storefrontProduct,
}: Props) {
  const {handle, title} = storefrontProduct;

  return (
    <ProductOptionsProvider
      data={storefrontProduct}
      initialVariantId={initialVariantId}
    >
      <Tippy
        interactive
        placement="top"
        render={() => <ProductTooltip storefrontProduct={storefrontProduct} />}
      >
        <Link to={`/products/${handle}`}>
          <div
            className={clsx(
              'inline-flex place-content-center whitespace-nowrap rounded-xs bg-lightGray px-1.5 py-1 text-sm leading-none text-darkGray duration-200 ease-out',
              'hover:bg-gray',
            )}
          >
            {title}
          </div>
        </Link>
      </Tippy>
    </ProductOptionsProvider>
  );
}
