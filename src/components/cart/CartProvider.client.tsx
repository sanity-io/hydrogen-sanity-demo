import {CartProvider as ShopifyCartProvider} from '@shopify/hydrogen';
import {ReactNode, useCallback} from 'react';
import CartUIProvider, {useCartUI} from './CartUIProvider.client';

/**
 * A client component that creates a cart object and provides callbacks that can be accessed by any descendent component using the `useCart` hook and related hooks
 */

type Props = {
  children: ReactNode;
  numCartLines: number;
};

export default function CartProvider({children, numCartLines}: Props) {
  return (
    <CartUIProvider>
      <Provider numCartLines={numCartLines}>{children}</Provider>
    </CartUIProvider>
  );
}

function Provider({children, numCartLines}: Props) {
  const {openCart} = useCartUI();

  const open = useCallback(() => {
    openCart();
  }, [openCart]);

  return (
    <>
      <ShopifyCartProvider
        numCartLines={numCartLines}
        onLineAdd={open}
        onCreate={open}
      >
        {children}
      </ShopifyCartProvider>
    </>
  );
}
