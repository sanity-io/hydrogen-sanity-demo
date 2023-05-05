import type {ShopifyAnalyticsProduct} from '@shopify/hydrogen';
import type {ProductVariant} from '@shopify/hydrogen/storefront-api-types';
import Tippy from '@tippyjs/react/headless';
import clsx from 'clsx';
import {ReactNode, useMemo} from 'react';

import Tooltip from '~/components/elements/Tooltip';
import CartIcon from '~/components/icons/Cart';
import CreditCardIcon from '~/components/icons/CreditCard';
import SpinnerIcon from '~/components/icons/Spinner';
import {Link} from '~/components/Link';
import {AddToCartLink} from '~/components/product/buttons/AddToCartButton';
import BuyNowButton from '~/components/product/buttons/BuyNowButton';
import ProductTooltip from '~/components/product/Tooltip';
import {useColorTheme} from '~/lib/theme';
import type {ProductWithNodes} from '~/types/shopify';

type Props = {
  children?: ReactNode;
  variantGid?: ProductVariant['id'];
  linkAction: 'addToCart' | 'buyNow' | 'link';
  quantity?: number;
  storefrontProduct: ProductWithNodes;
};

export default function ProductInlineLink({
  children,
  variantGid,
  linkAction,
  quantity = 1,
  storefrontProduct,
}: Props) {
  return (
    <ProductInlineLinkContent
      linkAction={linkAction}
      quantity={quantity}
      storefrontProduct={storefrontProduct}
      variantGid={variantGid}
    >
      {children}
    </ProductInlineLinkContent>
  );
}

function ProductInlineLinkContent({
  children,
  linkAction,
  quantity = 1,
  storefrontProduct,
  variantGid,
}: Props) {
  const colorTheme = useColorTheme();
  const {handle, title} = storefrontProduct;

  const selectedVariant =
    storefrontProduct.variants.nodes.find(
      (variant) => variant.id == variantGid,
    ) ?? storefrontProduct.variants.nodes[0];

  // Return text only if variant cannot be found
  if (!selectedVariant) {
    return <>{children}</>;
  }

  const productAnalytics: ShopifyAnalyticsProduct = {
    productGid: storefrontProduct.id ? storefrontProduct.id : '',
    variantGid: selectedVariant.id,
    name: storefrontProduct.title ? storefrontProduct.title : '',
    variantName: selectedVariant.title,
    brand: storefrontProduct.vendor ? storefrontProduct.vendor : '',
    price: selectedVariant.price.amount,
    quantity: 1,
  };

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

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const LoadingContent = useMemo(
    () => (
      <span
        className={clsx(
          'inline-flex place-content-center items-center rounded-xs bg-peach p-0.5 leading-none duration-200 ease-out',
          'hover:opacity-80',
        )}
        style={{background: colorTheme?.background}}
      >
        {children}
        <SpinnerIcon className="ml-[0.25em]" width={14} height={14} />
      </span>
    ),
    [children, colorTheme?.background],
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
          return (
            <ProductTooltip
              storefrontProduct={storefrontProduct}
              variantGid={variantGid}
            />
          );
        }
        return null;
      }}
      hideOnClick={false}
    >
      <span>
        {linkAction === 'addToCart' && (
          <AddToCartLink
            lines={[
              {
                merchandiseId: selectedVariant.id,
                quantity,
              },
            ]}
            mode="inline"
            disabled={!selectedVariant.availableForSale}
            analytics={{
              products: [productAnalytics],
              totalValue: parseFloat(productAnalytics.price),
            }}
            loadingContent={LoadingContent}
          >
            {LinkContent}
          </AddToCartLink>
        )}
        {linkAction === 'buyNow' && (
          <BuyNowButton
            lines={[
              {
                merchandiseId: selectedVariant.id,
                quantity,
              },
            ]}
            mode="inline"
            disabled={!selectedVariant.availableForSale}
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
