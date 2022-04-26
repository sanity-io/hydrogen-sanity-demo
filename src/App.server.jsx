import {ShopifyProvider} from '@shopify/hydrogen';
import renderHydrogen from '@shopify/hydrogen/entry-server';
import {Suspense} from 'react';
import shopifyConfig from '../shopify.config';
import LoadingFallback from './components/LoadingFallback';
import Main from './components/Main.server';
import CartProvider from './contexts/CartProvider.client';

function App({routes}) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ShopifyProvider shopifyConfig={shopifyConfig}>
        <CartProvider>
          <Main routes={routes} />
        </CartProvider>
      </ShopifyProvider>
    </Suspense>
  );
}

const routes = import.meta.globEager('./routes/**/*.server.[jt](s|sx)');

export default renderHydrogen(App, {shopifyConfig, routes});
