import {LocalizationProvider} from '@shopify/hydrogen';
import {Suspense} from 'react';
import Header from './Header.client';
import Footer from './Footer.client';
import Cart from './Cart.client';

export default function Layout({children}) {
  return (
    <LocalizationProvider preload="*">
      {/* TODO: Find out why Suspense needs to be here to prevent hydration errors. */}
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      <div className="min-h-screen max-w-screen overflow-x-hidden text-gray-700">
        <Suspense fallback={null}>
          <Cart />
        </Suspense>
        <main id="mainContent" role="main">
          <Suspense fallback={null}>{children}</Suspense>
        </main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>
    </LocalizationProvider>
  );
}
