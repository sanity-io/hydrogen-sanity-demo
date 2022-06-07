import {SanityMenuLink} from '../types';
import CartToggle from './cart/CartToggle.client';
import CountrySelector from './selects/SelectCountry.client';
import HeaderBackground from './HeaderBackgroundAndLogo.client';
import Navigation from './Navigation.server';
import clsx from 'clsx';

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
        'align-center fixed top-0 z-40 flex h-[4.375rem] w-full justify-between px-4 lg:h-[6.25rem]',
        'md:px-8',
      )}
      role="banner"
    >
      <HeaderBackground />

      <div className="flex items-center text-sm font-bold text-red lg:hidden">
        (Menu)
      </div>

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
