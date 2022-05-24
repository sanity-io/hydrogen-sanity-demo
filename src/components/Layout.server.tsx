import {LocalizationProvider} from '@shopify/hydrogen';
import groq from 'groq';
import {useSanityQuery} from 'hydrogen-plugin-sanity';
import {ReactNode, Suspense} from 'react';
import clientConfig from '../../sanity.config';
import {LINKS} from '../fragments/links';
import {SanityColorTheme, SanityMenuLink} from '../types';
import Cart from './Cart.client';
import Footer from './Footer.server';
import Header from './Header.server';

type Props = {
  children?: ReactNode;
  colorTheme?: SanityColorTheme;
};

/**
 * A server component that defines a structure and organization of a page that can be used in different parts of the Hydrogen app
 */
export default function Layout({children, colorTheme}: Props) {
  const {sanityData: menuLinks} = useSanityQuery<SanityMenuLink[]>({
    clientConfig,
    getProductGraphQLFragment: () => false,
    query: QUERY,
    // cache: CacheHours(),
    // preload: '*',
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
        className="max-w-screen flex min-h-screen flex-col font-sans text-gray-700"
        style={{background: colorTheme?.background || 'white'}}
      >
        {/* TODO: Find out why Suspense needs to be here to prevent hydration errors. */}
        <Suspense fallback={null}>
          {menuLinks && <Header menuLinks={menuLinks} />}
          <Cart />
        </Suspense>

        <main
          className="relative grow"
          id="mainContent"
          role="main"
          style={{color: colorTheme?.text || 'black'}}
        >
          {/* <div className="mx-auto max-w-7xl"> */}
          <div className="mx-auto">
            <Suspense fallback={null}>{children}</Suspense>
          </div>
        </main>

        <Footer />
      </div>
    </LocalizationProvider>
  );
}

const QUERY = groq`
  *[_type == 'settings'][0].menu.links[] {
    ${LINKS}
  }
`;
