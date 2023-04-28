import {useMatches} from '@remix-run/react';
import clsx from 'clsx';

import HeaderActions from '~/components/global/HeaderActions';
import HeaderBackground from '~/components/global/HeaderBackground';
import MobileNavigation from '~/components/global/MobileNavigation';
import Navigation from '~/components/global/Navigation';

/**
 * A server component that specifies the content of the header on the website
 */
export default function Header() {
  const [root] = useMatches();

  const layout = root.data?.layout;
  const {menuLinks} = layout || {};

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
