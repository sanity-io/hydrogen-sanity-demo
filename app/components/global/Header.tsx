import {useMatches} from '@remix-run/react';
import clsx from 'clsx';

import type {SanityMenuLink} from '~/types/sanity';

import HeaderActions from './HeaderActions';
import HeaderBackground from './HeaderBackground';
import MobileNavigation from './MobileNavigation';
import Navigation from './Navigation';

/**
 * A server component that specifies the content of the header on the website
 */
export default function Header() {
  const [root] = useMatches();

  const layout = root.data?.layout;
  const {menuLinks} = layout;

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
