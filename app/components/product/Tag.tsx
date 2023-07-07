import type {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';
import Tippy from '@tippyjs/react/headless';
import clsx from 'clsx';

import {Link} from '~/components/Link';
import ProductTooltip from '~/components/product/Tooltip';
import {useGid} from '~/lib/utils';

type Props = {
  productGid: Product['id'];
  variantGid?: ProductVariant['id'];
};

export default function ProductTag({productGid, variantGid}: Props) {
  const storefrontProduct = useGid<Product>(productGid);

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
