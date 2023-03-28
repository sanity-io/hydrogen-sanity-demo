import {Await, useMatches} from '@remix-run/react';
import {Cart} from '@shopify/hydrogen/storefront-api-types';
import {Suspense, useEffect} from 'react';

import {CartActions, CartLineItems, CartSummary} from '~/components/Cart';
import {Drawer, useDrawer} from '~/components/Drawer';
import {useCartFetchers} from '~/hooks/useCartFetchers';

import {CountrySelector} from './CountrySelector';
import {Link} from './Link';

type LayoutProps = {
  children: React.ReactNode;
  title: string;
};

export function Layout({children, title}: LayoutProps) {
  const {isOpen, openDrawer, closeDrawer} = useDrawer();
  const [root] = useMatches();
  const cart = root.data?.cart;

  // Grab all the fetchers that are adding to cart
  const addToCartFetchers = useCartFetchers('ADD_TO_CART');

  // When the fetchers array changes, open the drawer if there is an add to cart action
  useEffect(() => {
    if (isOpen || addToCartFetchers.length === 0) return;
    openDrawer();
  }, [addToCartFetchers, isOpen, openDrawer]);

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50 antialiased">
      <header
        role="banner"
        className={`shadow-sm sticky top-0 z-40 flex h-32 w-full items-center justify-between gap-4 bg-white p-6 leading-none antialiased transition md:p-8 lg:p-12`}
      >
        <div className="flex w-full items-center gap-12">
          <Link to="/" className="flex-grow font-bold">
            {title}
          </Link>
          <CountrySelector />
          <CartHeader cart={cart} openDrawer={openDrawer} />
        </div>
      </header>

      <main
        role="main"
        id="mainContent"
        className="flex-grow p-6 md:p-8 lg:p-12"
      >
        {children}
        <Drawer open={isOpen} onClose={closeDrawer}>
          <CartDrawer cart={cart} close={closeDrawer} />
        </Drawer>
      </main>
    </div>
  );
}

function CartHeader({cart, openDrawer}: {cart: Cart; openDrawer: () => void}) {
  return (
    <Suspense>
      <Await resolve={cart}>
        {(data) => (
          <button
            className="relative ml-auto flex h-8 w-8 items-center justify-center"
            onClick={openDrawer}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              <title>Bag</title>
              <path
                fillRule="evenodd"
                d="M8.125 5a1.875 1.875 0 0 1 3.75 0v.375h-3.75V5Zm-1.25.375V5a3.125 3.125 0 1 1 6.25 0v.375h3.5V15A2.625 2.625 0 0 1 14 17.625H6A2.625 2.625 0 0 1 3.375 15V5.375h3.5ZM4.625 15V6.625h10.75V15c0 .76-.616 1.375-1.375 1.375H6c-.76 0-1.375-.616-1.375-1.375Z"
              ></path>
            </svg>
            {data?.totalQuantity > 0 && (
              <div className="text-contrast absolute bottom-1 right-1 flex h-3 w-auto min-w-[0.75rem] items-center justify-center rounded-full bg-red px-[0.125rem] pb-px text-center text-[0.625rem] font-medium leading-none text-white subpixel-antialiased">
                <span>{data?.totalQuantity}</span>
              </div>
            )}
          </button>
        )}
      </Await>
    </Suspense>
  );
}

function CartDrawer({cart, close}: {cart: Cart; close: () => void}) {
  return (
    <Suspense>
      <Await resolve={cart}>
        {(data) => (
          <>
            {data?.totalQuantity > 0 ? (
              <>
                <div className="flex-1 overflow-y-auto">
                  <div className="flex flex-col items-center justify-between space-y-7 px-4 py-6 md:py-8 md:px-12">
                    <CartLineItems linesObj={data.lines} />
                  </div>
                </div>
                <div className="w-full space-y-6 px-4 py-6 md:px-12">
                  <CartSummary cost={data.cost} />
                  <CartActions checkoutUrl={data.checkoutUrl} />
                </div>
              </>
            ) : (
              <div className="flex h-screen flex-col items-center justify-center space-y-7 px-4 py-6 md:py-8 md:px-12">
                <h2 className="max-w-prose whitespace-pre-wrap text-4xl font-bold">
                  Your cart is empty
                </h2>
                <button
                  onClick={close}
                  className="inline-block w-full max-w-xl rounded-sm bg-black py-3 px-6 text-center font-medium leading-none text-white"
                >
                  Continue shopping
                </button>
              </div>
            )}
          </>
        )}
      </Await>
    </Suspense>
  );
}
