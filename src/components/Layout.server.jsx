import {LocalizationProvider} from '@shopify/hydrogen';
import Header from './Header.server';
import Footer from './Footer.server';
import Cart from './Cart.client';

export default function Layout({children}) {
  return (
    <LocalizationProvider>
      <Header />
      <div className="min-h-screen max-w-screen overflow-x-hidden text-gray-700">
        <Cart />
        <main id="mainContent">{children}</main>
        <Footer />
      </div>
    </LocalizationProvider>
  );
}
