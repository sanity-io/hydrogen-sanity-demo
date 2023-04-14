// import {Link, ProductOptionsProvider} from '@shopify/hydrogen';
import type {ProductVariant} from '@shopify/hydrogen/storefront-api-types';
import Tippy from '@tippyjs/react/headless';
import clsx from 'clsx';

import type {ProductWithNodes} from '~/types/shopify';

import {Link} from '../Link';

type Props = {
  initialVariantId?: ProductVariant['id'];
  storefrontProduct: ProductWithNodes;
  variantGid?: string;
};

export default function ProductTag({
  initialVariantId,
  storefrontProduct,
  variantGid,
}: Props) {
  const {handle, title} = storefrontProduct;

  return (
    // <ProductOptionsProvider
    //   data={storefrontProduct}
    //   initialVariantId={initialVariantId}
    // >
    //   <Tippy
    //     interactive
    //     placement="top"
    //     render={() => <ProductTooltip storefrontProduct={storefrontProduct} />}
    //   >
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
    //   </Tippy>
    // </ProductOptionsProvider>
  );
}
