import {SanityMenuLink} from '../types';
import CartToggle from './CartToggle.client';
import CountrySelector from './CountrySelector.client';
import HeaderBackground from './HeaderBackground.client';
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
      className="align-center fixed top-0 z-40 flex h-[100px] w-full justify-between px-8"
      role="banner"
    >
      {/*
        <MobileNavigation
          collections={collections}
          isOpen={isMobileNavOpen}
          setIsOpen={setIsMobileNavOpen}
        />
      */}

      <HeaderBackground />

      <div className="flex items-center text-sm font-bold text-red lg:hidden">
        (Menu)
      </div>

      <Navigation menuLinks={menuLinks} />

      {/* Country selector + Cart toggle */}
      <div className="relative flex items-center gap-2">
        <CountrySelector />
        <CartToggle />
      </div>
    </header>
  );
}
