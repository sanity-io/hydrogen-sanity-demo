import {LocalizationProvider} from '@shopify/hydrogen';
import groq from 'groq';
import {ReactNode, Suspense} from 'react';
import {LINKS} from '../fragments/links';
import useSanityQuery from '../hooks/useSanityQuery';
import type {SanityMenuLink} from '../types';
import Cart from './cart/Cart.client';
import Footer from './footer/Footer.server';
import Header from './header/Header.server';

/**
 * A server component that defines a structure and organization of a page that can be used in different parts of the Hydrogen app
 */

type Props = {
  backgroundColor?: string;
  children?: ReactNode;
};

export default function Layout({backgroundColor, children}: Props) {
  const {data: menuLinks} = useSanityQuery<SanityMenuLink[]>({
    query: QUERY_SANITY,
  });

  return (
    <LocalizationProvider preload="*">
      <div className="absolute top-0 left-0">
        <a
          href="#mainContent"
          className="sr-only p-4 focus:not-sr-only focus:block"
        >
          Skip to content
        </a>
      </div>

      <div
        className="max-w-screen flex min-h-screen flex-col"
        style={{background: backgroundColor}}
      >
        {/* TODO: Find out why Suspense needs to be here to prevent hydration errors. */}
        <Suspense fallback={null}>
          {menuLinks && <Header menuLinks={menuLinks} />}
          <Cart />
        </Suspense>

        <main className="relative grow" id="mainContent" role="main">
          <div className="mx-auto">
            <Suspense fallback={null}>{children}</Suspense>
          </div>
        </main>
      </div>

      <Footer />
    </LocalizationProvider>
  );
}

const QUERY_SANITY = groq`
  *[_type == 'settings'][0].menu.links[] {
    ${LINKS}
  }
`;
