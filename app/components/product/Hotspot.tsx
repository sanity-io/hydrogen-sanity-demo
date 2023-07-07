import type {Product} from '@shopify/hydrogen/storefront-api-types';
import Tippy from '@tippyjs/react/headless';
import clsx from 'clsx';

import {Link} from '~/components/Link';
import ProductTile from '~/components/product/Tile';
import {useGid} from '~/lib/utils';

type Props = {
  productGid: string;
  variantGid?: string;
  x: number;
  y: number;
};

export default function ProductHotspot({productGid, variantGid, x, y}: Props) {
  const storefrontProduct = useGid<Product>(productGid);

  if (!storefrontProduct) {
    return null;
  }

  return (
    <Tippy
      placement="top"
      render={() => {
        return (
          <ProductTile
            storefrontProduct={storefrontProduct}
            variantGid={variantGid}
          />
        );
      }}
    >
      <Link
        className={clsx(
          'absolute left-[50%] top-[50%] flex h-[26px] w-[26px] -translate-x-1/2 -translate-y-1/2 animate-pulse items-center justify-center rounded-full bg-offBlack duration-300 ease-out',
          'hover:scale-125 hover:animate-none',
        )}
        style={{
          left: `${x}%`,
          top: `${y}%`,
        }}
        to={`/products/${storefrontProduct.handle}`}
      >
        <div className="relative h-[4px] w-[4px] rounded-full bg-white" />
      </Link>
    </Tippy>
  );
}
