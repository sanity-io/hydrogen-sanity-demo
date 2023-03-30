import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import {
  Seo,
  type SeoHandleFunction,
  ShopifySalesChannel,
} from '@shopify/hydrogen';
import type {Cart, Shop} from '@shopify/hydrogen/storefront-api-types';
import {ShopifyProvider} from '@shopify/hydrogen-react';
import {
  AppLoadContext,
  defer,
  type LinksFunction,
  type LoaderArgs,
  type MetaFunction,
} from '@shopify/remix-oxygen';

import {CART_QUERY} from '~/queries/shopify/cart';

import {Layout} from './components/global/Layout';
import {useAnalytics} from './hooks/useAnalytics';
import {DEFAULT_LOCALE} from './lib/utils';
import stylesheet from './styles/tailwind.css';
import {I18nLocale} from './types/shopify';

const seo: SeoHandleFunction<typeof loader> = ({data}) => ({
  title: data?.layout?.seo?.title,
  description: data?.layout?.seo?.description,
});

export const handle = {
  seo,
};

export const links: LinksFunction = () => {
  return [
    {rel: 'stylesheet', href: stylesheet},
    {
      href: 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,500;0,700;1,500;1,700&display=swap',
      rel: 'stylesheet',
    },
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
      crossOrigin: 'anonymous',
    },
  ];
};

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  viewport: 'width=device-width,initial-scale=1',
});

export async function loader({context}: LoaderArgs) {
  const [cartId, shop] = await Promise.all([
    context.session.get('cartId'),
    context.storefront.query<{shop: Shop}>(SHOP_QUERY),
  ]);

  const selectedLocale = context.storefront.i18n as I18nLocale;

  const shopifyConfig = {
    storefrontToken: context.env.PUBLIC_STOREFRONT_API_TOKEN,
    storeDomain: `https://${context.env.PUBLIC_STORE_DOMAIN}`,
    storefrontApiVersion: context.env.PUBLIC_STOREFRONT_API_VERSION,
    countryIsoCode: selectedLocale.country,
    languageIsoCode: selectedLocale.language,
  };

  return defer({
    shop,
    layout: testSanityLayout,
    cart: cartId ? getCart(context, cartId) : undefined,
    selectedLocale,
    shopifyConfig,
    analytics: {
      shopifySalesChannel: ShopifySalesChannel.hydrogen,
      shopId: shop.shop.id,
    },
  });
}

export default function App() {
  const data = useLoaderData<typeof loader>();
  const {shopifyConfig} = data;
  const locale = data.selectedLocale ?? DEFAULT_LOCALE;
  const hasUserConsent = true;

  useAnalytics(hasUserConsent, locale);

  return (
    <ShopifyProvider {...shopifyConfig}>
      <html lang={locale.language}>
        <head>
          <Seo />
          <Meta />
          <Links />
        </head>
        <body>
          <Layout key={`${locale.language}-${locale.country}`}>
            <Outlet />
          </Layout>
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    </ShopifyProvider>
  );
}

const SHOP_QUERY = `#graphql
  query layout {
    shop {
      id
      name
      description
    }
  }
`;

async function getCart({storefront}: AppLoadContext, cartId: string) {
  if (!storefront) {
    throw new Error('missing storefront client in cart query');
  }

  const {cart} = await storefront.query<{cart?: Cart}>(CART_QUERY, {
    variables: {
      cartId,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
    cache: storefront.CacheNone(),
  });

  return cart;
}

// TODO: remove this when we have a real query strategy
const testSanityLayout = {
  menuLinks: [
    {
      _key: '578e4f61ee38',
      _type: 'collectionGroup',
      collectionLinks: [
        {
          _id: 'shopifyCollection-395301290235',
          _key: null,
          colorTheme: {
            background: '#ffeed3',
            text: '#ffa81b',
          },
          gid: 'gid://shopify/Collection/395301290235',
          slug: '/collections/everything',
          title: 'All Products',
          vector:
            'https://cdn.sanity.io/images/g2b4qblu/production/1a629777129eaef7d363b5af85e98ae69037baf8-133x146.svg',
        },
        {
          _id: 'shopifyCollection-395301519611',
          _key: null,
          colorTheme: {
            background: '#cfe8e5',
            text: '#3d7544',
          },
          gid: 'gid://shopify/Collection/395301519611',
          slug: '/collections/bathroom',
          title: 'Bathroom',
          vector:
            'https://cdn.sanity.io/images/g2b4qblu/production/a7d7aeecd12bb7fb9162fa5f0410385dafac51a1-131x146.svg',
        },
        {
          _id: 'shopifyCollection-395607081211',
          _key: null,
          colorTheme: {
            background: '#e3d8ff',
            text: '#724ad2',
          },
          gid: 'gid://shopify/Collection/395607081211',
          slug: '/collections/living',
          title: 'Living',
          vector:
            'https://cdn.sanity.io/images/g2b4qblu/production/9cb69b79bb98176739fe714aa72c8b1644c97999-132x146.svg',
        },
        {
          _id: 'shopifyCollection-396461834491',
          _key: null,
          colorTheme: {
            background: '#ffe5f0',
            text: '#ec5039',
          },
          gid: 'gid://shopify/Collection/396461834491',
          slug: '/collections/prints',
          title: 'Prints',
          vector:
            'https://cdn.sanity.io/images/g2b4qblu/production/60b7987913afc73fca2a516ae609680bfd156ed7-133x146.svg',
        },
      ],
      collectionProducts: {
        _id: 'shopifyCollection-395607245051',
        _key: null,
        colorTheme: {
          background: '#e3d8ff',
          text: '#724ad2',
        },
        gid: 'gid://shopify/Collection/395607245051',
        slug: '/collections/best-sellers-in-stock',
        title: 'New Arrivals',
        vector: null,
      },
      title: 'Products',
    },
    {
      _key: '0ad9402b2bca',
      _type: 'linkInternal',
      documentType: 'page',
      slug: '/pages/story',
      title: 'Story',
    },
    {
      _key: 'd7742bb3474e',
      _type: 'linkInternal',
      documentType: 'page',
      slug: '/pages/process',
      title: 'Process',
    },
    {
      _key: 'f82d06a43e24',
      _type: 'linkInternal',
      documentType: 'page',
      slug: '/pages/about',
      title: 'About this demo',
    },
  ],
  seo: {
    description:
      "Sanity.io can power remarkable storefronts on Shopify's Hydrogen framework.",
    title: 'AKVA',
  },
};
