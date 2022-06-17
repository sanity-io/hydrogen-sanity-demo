import Tippy from '@tippyjs/react/headless';
import clsx from 'clsx';
import {ProductWithNodes} from '../../types';
import ProductTile from './Tile';

type Props = {
  storefrontProduct: ProductWithNodes;
  x: number;
  y: number;
};

export default function ProductHotspot({storefrontProduct, x, y}: Props) {
  if (!storefrontProduct) {
    return null;
  }

  return (
    <Tippy
      interactive
      placement="top"
      render={() => {
        return <ProductTile storefrontProduct={storefrontProduct} />;
      }}
    >
      <div
        className={clsx(
          'absolute left-[50%] top-[50%] flex h-[20px] w-[20px] -translate-x-1/2 -translate-y-1/2 animate-pulse items-center justify-center rounded-full border border-white bg-black bg-opacity-30',
          'hover:animate-none',
        )}
        style={{
          left: `${x}%`,
          top: `${y}%`,
        }}
      >
        <div className="h-1/3 w-1/3 rounded-full bg-white" />
      </div>
    </Tippy>
  );
}
