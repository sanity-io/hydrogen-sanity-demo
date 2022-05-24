import {
  FileRoutes,
  PerformanceMetrics,
  PerformanceMetricsDebug,
  Route,
  Router,
  ShopifyProvider,
} from '@shopify/hydrogen';
import renderHydrogen from '@shopify/hydrogen/entry-server';
import {Suspense} from 'react';
import CartProvider from './components/CartProvider.client';
import DefaultSeo from './components/DefaultSeo.server';
import LoadingFallback from './components/LoadingFallback';
import NotFound from './components/NotFound.server';

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ShopifyProvider>
        {/* @ts-expect-error <CartProvider> doesn't require `numCartLines` */}
        <CartProvider>
          <DefaultSeo />
          <Router>
            <FileRoutes />
            {/* @ts-expect-error <NotFound> doesn't require response */}
            <Route path="*" page={<NotFound />} />
          </Router>
        </CartProvider>
        <PerformanceMetrics />
        {process.env.LOCAL_DEV && <PerformanceMetricsDebug />}
      </ShopifyProvider>
    </Suspense>
  );
}

export default renderHydrogen(App);
