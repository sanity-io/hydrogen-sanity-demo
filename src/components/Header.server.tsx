import {Link} from '@shopify/hydrogen/client';
import {SanityMenuLink} from '../types';
import CartToggle from './CartToggle.client';
import CountrySelector from './CountrySelector.client';
import Navigation from './Navigation.server';

type Props = {
  menuLinks: SanityMenuLink[];
};

/**
 * A server component that specifies the content of the header on the website
 */
export default function Header({menuLinks}: Props) {
  return (
    <header className="sticky top-0 z-20" role="banner">
      <div className={`mx-auto w-full bg-white bg-opacity-95 lg:px-4`}>
        <div className="flex h-full place-content-between items-stretch lg:flex-col">
          <div className="flex w-full items-stretch justify-between">
            {/*
              <MobileNavigation
                collections={collections}
                isOpen={isMobileNavOpen}
                setIsOpen={setIsMobileNavOpen}
              />
          */}

            <div className="lg:hidden">(Menu)</div>

            <Navigation menuLinks={menuLinks} />

            {/* Logo */}
            <div className="absolute bottom-0 top-0 left-1/2 flex -translate-x-1/2 items-center">
              <Link className="font-bold" to="/">
                Store name
              </Link>
            </div>

            {/* Country selector + Cart toggle */}
            <div className="flex items-center gap-2">
              <CountrySelector />
              <CartToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
