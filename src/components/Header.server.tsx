import {Link} from '@shopify/hydrogen';
import {SanityMenuLink} from '../types';
import CartToggle from './CartToggle.client';
import CountrySelector from './CountrySelector.client';
import Logo from './Logo.client';
import Navigation from './Navigation.server';

type Props = {
  menuLinks: SanityMenuLink[];
};

/**
 * A server component that specifies the content of the header on the website
 */
export default function Header({menuLinks}: Props) {
  return (
    <header
      className="align-center fixed top-0 z-20 flex h-[100px] w-full justify-between px-8"
      role="banner"
    >
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
          <Logo />
        </Link>
      </div>

      {/* Country selector + Cart toggle */}
      <div className="flex items-center gap-2">
        <CountrySelector />
        <CartToggle />
      </div>
      {/*
        <div className="flex h-full place-content-between items-stretch lg:flex-col">
        </div>
          */}
    </header>
  );
}
