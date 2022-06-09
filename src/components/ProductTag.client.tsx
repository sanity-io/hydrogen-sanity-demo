import {Link, useProduct} from '@shopify/hydrogen';
import Tippy from '@tippyjs/react/headless';
import clsx from 'clsx';
import TooltipProduct from './tooltips/TooltipProduct.client';

export default function ProductTag() {
  const {handle, title} = useProduct();

  return (
    <Tippy interactive placement="top" render={() => <TooltipProduct />}>
      <Link to={`/products/${handle}`}>
        <div
          className={clsx(
            'place-content-center rounded-xs bg-lightGray px-1.5 py-1 text-sm leading-none text-darkGray duration-200 ease-out',
            'hover:bg-gray',
          )}
        >
          {title}
        </div>
      </Link>
    </Tippy>
  );
}
