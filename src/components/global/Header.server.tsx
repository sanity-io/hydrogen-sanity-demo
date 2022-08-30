import clsx from 'clsx';
import type {SanityMenuLink} from '../../types';
import HeaderActions from './HeaderActions.client';
import HeaderBackground from './HeaderBackground.client';
import MobileNavigation from './MobileNavigation.client';
import Navigation from './Navigation.server';

type Props = {
  menuLinks?: SanityMenuLink[];
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

      {menuLinks && <MobileNavigation menuLinks={menuLinks} />}

      {menuLinks && <Navigation menuLinks={menuLinks} />}

      {/* Accounts, country selector + cart toggle */}
      <HeaderActions />
    </header>
  );
}
