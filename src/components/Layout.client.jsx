import {useCartUI} from '../contexts/CartUIProvider.client';

import Header from './Header.client';
import Footer from './Footer.client';
import Cart from './Cart.client';

export default function Layout({children}) {
  const {isCartOpen, closeCart} = useCartUI();

  // TODO: close the cart automatically whenever the URL changes

  return (
    <>
      <div className="min-h-screen max-w-screen text-gray-700">
        <Header />

        {/* eslint-disable-next-line @shopify/jsx-prefer-fragment-wrappers */}
        <div>
          <div
            className={`z-50 fixed top-0 bottom-0 left-0 right-0 bg-black transition-opacity duration-400 ${
              isCartOpen ? 'opacity-20' : 'opacity-0 pointer-events-none'
            }`}
            onClick={isCartOpen ? closeCart : null}
          />
          <div
            className={`
            pointer-events-none z-50 h-full fixed right-0 top-0 bottom-0 flex flex-col w-full max-w-md min-w-sm transition-transform duration-500 transform-gpu ${
              isCartOpen ? 'right-0' : 'translate-x-full'
            }`}
          >
            <Cart />
          </div>
        </div>

        <main id="mainContent">{children}</main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
