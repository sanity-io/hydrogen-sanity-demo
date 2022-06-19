import clsx from 'clsx';
import type {SanityMenuLink} from '../../types';
import CartToggle from '../cart/CartToggle.client';
import CountrySelect from './CountrySelect.client';
import HeaderBackground from './HeaderBackground.client';
import MobileNavigation from './MobileNavigation.client';
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
      className={clsx(
        'align-center fixed top-0 z-40 flex h-header-sm w-full px-4',
        'md:px-8',
        'lg:h-header-lg',
      )}
      role="banner"
    >
      <HeaderBackground />

      <MobileNavigation menuLinks={menuLinks} />

      <Navigation menuLinks={menuLinks} />

      {/* Country selector + Cart toggle */}
      <div
        className={clsx(
          'absolute right-0 flex h-full items-center', //
          'md:mr-4',
        )}
      >
        <div
          className={clsx(
            'hidden', //
            'lg:block',
          )}
        >
          <CountrySelect />
        </div>
        <div className="flex h-full items-center justify-center py-4 pr-4 pl-2">
          <CartToggle />
        </div>
      </div>
    </header>
  );
}
