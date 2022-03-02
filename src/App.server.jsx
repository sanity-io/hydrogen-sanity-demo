import {ShopifyProvider} from '@shopify/hydrogen';
import renderHydrogen from '@shopify/hydrogen/entry-server';
import {Suspense} from 'react';
import shopifyConfig from '../shopify.config';
import LoadingFallback from './components/LoadingFallback';
import Main from './components/Main.server';
import CartProvider from './contexts/CartProvider.client';

function App({log, pages, ...serverState}) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ShopifyProvider shopifyConfig={shopifyConfig}>
        <CartProvider>
          <Main log={log} pages={pages} serverState={serverState} />
        </CartProvider>
      </ShopifyProvider>
    </Suspense>
  );
}

const pages = import.meta.globEager('./pages/**/*.server.[jt](s|sx)');

export default renderHydrogen(App, {pages});
