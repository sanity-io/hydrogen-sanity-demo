import {defineConfig} from '@shopify/hydrogen/config';
import {
  CookieSessionStorage,
  PerformanceMetricsServerAnalyticsConnector,
} from '@shopify/hydrogen';

export default defineConfig({
  shopify: () => ({
    defaultLocale: 'en',
    storeDomain: Oxygen.env.SHOPIFY_STORE_DOMAIN,
    storefrontToken: Oxygen.env.SHOPIFY_STOREFRONT_API_PUBLIC_TOKEN,
    storefrontApiVersion: '2022-07',
  }),
  session: CookieSessionStorage('__session', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30,
  }),
  serverAnalyticsConnectors: [PerformanceMetricsServerAnalyticsConnector],
});
