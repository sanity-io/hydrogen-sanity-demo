import {SanityMenuLink} from '../types';
import CartToggle from './cart/CartToggle.client';
import CountrySelector from './selects/SelectCountry.client';
import HeaderBackground from './HeaderBackgroundAndLogo.client';
import Navigation from './Navigation.server';
import clsx from 'clsx';
import MobileNavigation from './MobileNavigation.client';

type Props = {
  menuLinks: SanityMenuLink[];
};

/**
 * A server component that specifies the content of the header on the website
 */
export default function Header({menuLinks}: Props) {
  return (
    <header
      className={clsx(
        'align-center fixed top-0 z-40 flex h-header-sm w-full justify-between px-4',
        'md:px-8',
        'lg:h-header-lg',
      )}
      role="banner"
    >
      <HeaderBackground />

      <MobileNavigation menuLinks={menuLinks} />

      <Navigation menuLinks={menuLinks} />

      {/* Country selector + Cart toggle */}
      <div className="relative flex items-center gap-2">
        <div
          className={clsx(
            'hidden', //
            'lg:block',
          )}
        >
          <CountrySelector />
        </div>
        <CartToggle />
      </div>
    </header>
  );
}
