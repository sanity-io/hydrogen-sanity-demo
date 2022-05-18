import {Link} from '@shopify/hydrogen/client';
import {useEffect, useState} from 'react';
import CartToggle from './CartToggle.client';
import {useCartUI} from './CartUIProvider.client';
import CountrySelector from './CountrySelector.client';
import MobileNavigation from './MobileNavigation.client';
import Navigation from './Navigation.client';

/**
 * A client component that specifies the content of the header on the website
 */
export default function Header({collections, storeName}) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const {isCartOpen} = useCartUI();

  useEffect(() => {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    setScrollbarWidth(scrollbarWidth);
  }, [isCartOpen]);

  return (
    <header className="sticky top-0 z-20" role="banner">
      <div
        className={`h-20 lg:h-auto w-full border-b border-black md:py-6 lg:pt-4 lg:pb-0 mx-auto bg-white ${
          isMobileNavOpen ? '' : 'bg-opacity-95'
        }`}
      >
        <div
          className="h-full flex lg:flex-col place-content-between"
          style={{
            paddingRight: isCartOpen ? scrollbarWidth : 0,
          }}
        >
          <div className="text-center w-full flex justify-between items-center px-2">
            <CountrySelector />

            <MobileNavigation
              collections={collections}
              isOpen={isMobileNavOpen}
              setIsOpen={setIsMobileNavOpen}
            />

            {/* Logo */}
            <Link className="font-semibold" to="/">
              Hydrogen demo
            </Link>

            <CartToggle
              handleClick={() => {
                if (isMobileNavOpen) setIsMobileNavOpen(false);
              }}
            />
          </div>

          <Navigation collections={collections} storeName={storeName} />
        </div>
      </div>
    </header>
  );
}
