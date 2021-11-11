import Header from './Header.server';
import Footer from './Footer.server';
import Cart from './Cart.client';

export default function Layout({children}) {
  // TODO: close the cart automatically whenever the URL changes
  return (
    <>
      <div className="min-h-screen max-w-screen overflow-x-hidden text-gray-700">
        <Header />
        <Cart />
        <main id="mainContent">{children}</main>
        <Footer />
      </div>
    </>
  );
}
