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
import {
  AppLoadContext,
  defer,
  type LinksFunction,
  type LoaderArgs,
  type MetaFunction,
} from '@shopify/remix-oxygen';

import {CART_QUERY} from '~/queries/shopify/cart';

import favicon from '../public/favicon.svg';
import {Layout} from './components/Layout';
import {useAnalytics} from './hooks/useAnalytics';
import {DEFAULT_LOCALE} from './lib/utils';
import stylesheet from './styles/tailwind.css';
import {I18nLocale} from './types/shopify';

const seo: SeoHandleFunction<typeof loader> = ({data, pathname}) => ({
  title: data?.layout?.shop?.name,
  description: data?.layout?.shop?.description,
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
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
};

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  viewport: 'width=device-width,initial-scale=1',
});

export async function loader({context}: LoaderArgs) {
  const [cartId, layout] = await Promise.all([
    context.session.get('cartId'),
    context.storefront.query<{shop: Shop}>(LAYOUT_QUERY),
  ]);

  return defer({
    layout,
    cart: cartId ? getCart(context, cartId) : undefined,
    selectedLocale: context.storefront.i18n as I18nLocale,
    analytics: {
      shopifySalesChannel: ShopifySalesChannel.hydrogen,
      shopId: layout.shop.id,
    },
  });
}

export default function App() {
  const data = useLoaderData<typeof loader>();
  const locale = data.selectedLocale ?? DEFAULT_LOCALE;
  const hasUserConsent = true;

  useAnalytics(hasUserConsent, locale);

  const {name} = data.layout.shop;

  return (
    <html lang={locale.language}>
      <head>
        <Seo />
        <Meta />
        <Links />
      </head>
      <body>
        <Layout title={name} key={`${locale.language}-${locale.country}`}>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

const LAYOUT_QUERY = `#graphql
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
