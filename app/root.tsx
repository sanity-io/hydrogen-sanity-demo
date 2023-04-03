import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
  useMatches,
} from '@remix-run/react';
import {PreviewSuspense} from '@sanity/preview-kit';
import {
  Seo,
  type SeoHandleFunction,
  ShopifySalesChannel,
} from '@shopify/hydrogen';
import type {Cart, Shop} from '@shopify/hydrogen/storefront-api-types';
import {
  type AppLoadContext,
  defer,
  type LinksFunction,
  type LoaderArgs,
  type MetaFunction,
} from '@shopify/remix-oxygen';
import type {ReactNode} from 'react';

import {GenericError} from '~/components/global/GenericError';
import {Layout} from '~/components/global/Layout';
import {NotFound} from '~/components/global/NotFound';
import {useAnalytics} from '~/hooks/useAnalytics';
import {useNonce} from '~/lib/nonce';
import {DEFAULT_LOCALE} from '~/lib/utils';
import {LAYOUT_QUERY} from '~/queries/sanity/layout';
import {CART_QUERY} from '~/queries/shopify/cart';
import stylesheet from '~/styles/tailwind.css';
import type {I18nLocale} from '~/types/shopify';

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
  const [cartId, shop, layout] = await Promise.all([
    context.session.get('cartId'),
    context.storefront.query<{shop: Shop}>(SHOP_QUERY),
    context.sanity.client.fetch(LAYOUT_QUERY),
  ]);

  const selectedLocale = context.storefront.i18n as I18nLocale;

  return defer({
    layout,
    cart: cartId ? getCart(context, cartId) : undefined,
    selectedLocale,
    storeDomain: context.storefront.getShopifyDomain(),
    analytics: {
      shopifySalesChannel: ShopifySalesChannel.hydrogen,
      shopId: shop.shop.id,
    },
    isPreview: context.sanity.isPreview,
  });
}

export default function App() {
  const {isPreview, ...data} = useLoaderData<typeof loader>();
  const locale = data.selectedLocale ?? DEFAULT_LOCALE;
  const hasUserConsent = true;
  const nonce = useNonce();

  useAnalytics(hasUserConsent, locale);

  return (
    <html lang={locale.language}>
      <head>
        <Seo />
        <Meta />
        <Links />
      </head>
      <body>
        <Preview enabled={isPreview}>
          <Layout key={`${locale.language}-${locale.country}`}>
            <Outlet />
          </Layout>
        </Preview>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export function CatchBoundary() {
  const [root] = useMatches();
  const caught = useCatch();
  const isNotFound = caught.status === 404;

  const {selectedLocale, layout} = root.data;
  const locale = selectedLocale ?? DEFAULT_LOCALE;
  const {notFoundPage} = layout;

  return (
    <html lang={locale.language}>
      <head>
        <title>{isNotFound ? 'Not found' : 'Error'}</title>
        <Meta />
        <Links />
      </head>
      <body>
        <Layout
          key={`${locale.language}-${locale.country}`}
          backgroundColor={notFoundPage?.colorTheme?.background}
        >
          {isNotFound ? (
            <NotFound sanityData={notFoundPage} />
          ) : (
            <GenericError
              error={{message: `${caught.status} ${caught.data}`}}
            />
          )}
        </Layout>
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary({error}: {error: Error}) {
  const [root] = useMatches();

  const {selectedLocale} = root.data;
  const locale = selectedLocale ?? DEFAULT_LOCALE;

  return (
    <html lang={locale.language}>
      <head>
        <title>Error</title>
        <Meta />
        <Links />
      </head>
      <body>
        <Layout key={`${locale.language}-${locale.country}`}>
          <GenericError error={error} />
        </Layout>
        <Scripts />
      </body>
    </html>
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

/**
 * @todo move elsewhere
 */
type PreviewProps = {children: ReactNode; enabled: boolean};

function Preview(props: PreviewProps) {
  const {children, enabled} = props;

  return enabled ? (
    <PreviewSuspense fallback={<div>Loading preview...</div>}>
      {children}
    </PreviewSuspense>
  ) : (
    <>{children}</>
  );
}
