import {
  CookieSessionStorage,
  defineConfig,
  PerformanceMetricsServerAnalyticsConnector,
  ShopifyServerAnalyticsConnector,
} from '@shopify/hydrogen/config';

export default defineConfig({
  routes: '/src/routes',
  shopify: {
    storeDomain: 'oxygenator.myshopify.com',
    storefrontToken: '70faab4b482211c4167f94181a4ba4ed',
    storefrontApiVersion: '2022-07',
  },
  session: CookieSessionStorage('__session', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 60 * 60 * 24 * 30,
  }),
  serverAnalyticsConnectors: [
    PerformanceMetricsServerAnalyticsConnector,
    ShopifyServerAnalyticsConnector,
  ],
});
