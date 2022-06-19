import {CartProvider as ShopifyCartProvider} from '@shopify/hydrogen';
import type {CartBuyerIdentityInput} from '@shopify/hydrogen/storefront-api-types';
import {ReactNode, useCallback} from 'react';
import CartUIProvider, {useCartUI} from './CartUIProvider.client';

/**
 * A client component that creates a cart object and provides callbacks that can be accessed by any descendent component using the `useCart` hook and related hooks
 */

type Props = {
  children: ReactNode;
  customerAccessToken?: CartBuyerIdentityInput['customerAccessToken'];
  numCartLines?: number;
};

export default function CartProvider({
  children,
  customerAccessToken,
  numCartLines,
}: Props) {
  return (
    <CartUIProvider>
      <Provider
        customerAccessToken={customerAccessToken}
        numCartLines={numCartLines}
      >
        {children}
      </Provider>
    </CartUIProvider>
  );
}

function Provider({children, customerAccessToken, numCartLines}: Props) {
  const {openCart} = useCartUI();

  const open = useCallback(() => {
    openCart();
  }, [openCart]);

  return (
    <>
      <ShopifyCartProvider
        customerAccessToken={customerAccessToken}
        numCartLines={numCartLines}
        onLineAdd={open}
        onCreate={open}
      >
        {children}
      </ShopifyCartProvider>
    </>
  );
}
