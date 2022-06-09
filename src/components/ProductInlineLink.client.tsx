import {
  AddToCartButton,
  BuyNowButton,
  Link,
  useProduct,
} from '@shopify/hydrogen';
import Tippy from '@tippyjs/react/headless';
import clsx from 'clsx';
import {ReactNode} from 'react';
import type {SanityColorTheme} from '../types';
import IconCard from './icons/IconCard';
import IconCart from './icons/IconCart';
import Tooltip from './Tooltip';
import TooltipProduct from './tooltips/TooltipProduct.client';

type Props = {
  children?: ReactNode;
  colorTheme?: SanityColorTheme;
  linkAction: 'addToCart' | 'buyNow' | 'link';
  quantity?: number;
};

export default function ProductInlineLink({
  children,
  colorTheme,
  linkAction,
  quantity = 1,
}: Props) {
  const {handle, selectedVariant, title} = useProduct();

  // Return text only if variant cannot be found
  if (!selectedVariant) {
    return <>{children}</>;
  }

  // Return strikethrough text and sold out label if variant is not for sale AND we're using a 'buyNow' or 'addToCart' action
  if (!selectedVariant.availableForSale && linkAction !== 'link') {
    return (
      <>
        <span className="text-darkGray line-through">{children}</span>
        <span className="color-white ml-[0.25em] rounded-xs bg-lightGray px-1 py-0.5 text-xs font-bold text-red">
          Sold out
        </span>
      </>
    );
  }

  const LinkContent = (
    <span
      className={clsx(
        'inline-flex place-content-center items-center rounded-xs bg-peach p-0.5 leading-none duration-200 ease-out',
        'hover:opacity-80',
      )}
      style={{background: colorTheme?.background}}
    >
      {children}
      {linkAction === 'addToCart' && <IconCart className="ml-[0.25em]" />}
      {linkAction === 'buyNow' && <IconCard className="ml-[0.25em]" />}
    </span>
  );

  return (
    <Tippy
      interactive={linkAction === 'link'}
      placement="top"
      render={() => {
        if (linkAction === 'addToCart') {
          return <Tooltip label={`Add to cart: ${title}`} tone="dark" />;
        }
        if (linkAction === 'buyNow') {
          return <Tooltip label={`Buy now: ${title}`} tone="dark" />;
        }
        if (linkAction === 'link') {
          return <TooltipProduct />;
        }
        return null;
      }}
    >
      <span>
        {linkAction === 'addToCart' && (
          <AddToCartButton
            quantity={quantity}
            style={{fontWeight: 'inherit', letterSpacing: 'inherit'}}
            variantId={selectedVariant.id}
          >
            {LinkContent}
          </AddToCartButton>
        )}
        {linkAction === 'buyNow' && (
          <BuyNowButton
            quantity={quantity}
            style={{fontWeight: 'inherit', letterSpacing: 'inherit'}}
            variantId={selectedVariant.id}
          >
            {LinkContent}
          </BuyNowButton>
        )}
        {linkAction === 'link' && (
          <Link to={`/products/${handle}`}>{LinkContent}</Link>
        )}
      </span>
    </Tippy>
  );
}
