import type {ProductVariant} from '@shopify/hydrogen/storefront-api-types';
import Tippy from '@tippyjs/react/headless';
import clsx from 'clsx';

import {Link} from '~/components/Link';
import ProductTooltip from '~/components/product/Tooltip';
import type {ProductWithNodes} from '~/types/shopify';

type Props = {
  storefrontProduct: ProductWithNodes;
  variantGid?: ProductVariant['id'];
};

export default function ProductTag({storefrontProduct, variantGid}: Props) {
  if (!storefrontProduct) {
    return null;
  }

  const {handle, title} = storefrontProduct;

  return (
    <Tippy
      interactive
      placement="top"
      render={() => (
        <ProductTooltip
          storefrontProduct={storefrontProduct}
          variantGid={variantGid}
        />
      )}
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
  );
}
