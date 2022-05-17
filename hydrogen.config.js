import {defineConfig} from '@shopify/hydrogen/config';

export default defineConfig({
  routes: import.meta.globEager('./src/routes/**/*.server.[jt](s|sx)'),
  shopify: {
    defaultLocale: 'en',
    storeDomain: 'oxygenator.myshopify.com',
    storefrontToken: '87f9f62622ee57ee7fe8beaf50ecedb9',
    storefrontApiVersion: '2022-07',
  },
});
