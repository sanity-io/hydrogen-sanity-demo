import {
  AddToCartButton,
  BuyNowButton,
  Link,
  ProductOptionsProvider,
  useProductOptions,
} from '@shopify/hydrogen';
import type {ProductVariant} from '@shopify/hydrogen/storefront-api-types';
// @ts-expect-error incompatibility with node16 resolution
import Tippy from '@tippyjs/react/headless';
import clsx from 'clsx';
import {ReactNode, useMemo} from 'react';
import type {ProductWithNodes, SanityColorTheme} from '../../types';
import Tooltip from '../elements/Tooltip';
import CartIcon from '../icons/Cart';
import CreditCardIcon from '../icons/CreditCard';
import ProductTooltip from '../product/Tooltip.client';

type Props = {
  children?: ReactNode;
  colorTheme?: SanityColorTheme;
  initialVariantId?: ProductVariant['id'];
  linkAction: 'addToCart' | 'buyNow' | 'link';
  quantity?: number;
  storefrontProduct: ProductWithNodes;
};

export default function ProductInlineLink({
  children,
  colorTheme,
  initialVariantId,
  linkAction,
  quantity = 1,
  storefrontProduct,
}: Props) {
  return (
    <ProductOptionsProvider
      data={storefrontProduct}
      initialVariantId={initialVariantId}
    >
      <ProductInlineLinkContent
        colorTheme={colorTheme}
        linkAction={linkAction}
        quantity={quantity}
        storefrontProduct={storefrontProduct}
      >
        {children}
      </ProductInlineLinkContent>
    </ProductOptionsProvider>
  );
}

function ProductInlineLinkContent({
  children,
  colorTheme,
  linkAction,
  quantity = 1,
  storefrontProduct,
}: Props) {
  const {handle, title} = storefrontProduct;
  const {selectedVariant} = useProductOptions();

  // Return text only if variant cannot be found
  if (!selectedVariant?.id) {
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

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const LinkContent = useMemo(
    () => (
      <span
        className={clsx(
          'inline-flex place-content-center items-center rounded-xs bg-peach p-0.5 leading-none duration-200 ease-out',
          'hover:opacity-80',
        )}
        style={{background: colorTheme?.background}}
      >
        {children}
        {linkAction === 'addToCart' && <CartIcon className="ml-[0.25em]" />}
        {linkAction === 'buyNow' && <CreditCardIcon className="ml-[0.25em]" />}
      </span>
    ),
    [children, colorTheme?.background, linkAction],
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
          return <ProductTooltip storefrontProduct={storefrontProduct} />;
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
