import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useMatches,
  useRouteError,
} from '@remix-run/react';
import {
  Seo,
  type SeoHandleFunction,
  ShopifySalesChannel,
} from '@shopify/hydrogen';
import type {
  Cart,
  Collection,
  Shop,
} from '@shopify/hydrogen/storefront-api-types';
import {
  type AppLoadContext,
  defer,
  type LinksFunction,
  type LoaderArgs,
} from '@shopify/remix-oxygen';
import {getPreview, PreviewProvider} from 'hydrogen-sanity';

import {GenericError} from '~/components/global/GenericError';
import {Layout} from '~/components/global/Layout';
import {NotFound} from '~/components/global/NotFound';
import {PreviewLoading} from '~/components/global/PreviewLoading';
import {useAnalytics} from '~/hooks/useAnalytics';
import {useNonce} from '~/lib/nonce';
import {DEFAULT_LOCALE} from '~/lib/utils';
import {LAYOUT_QUERY} from '~/queries/sanity/layout';
import {CART_QUERY} from '~/queries/shopify/cart';
import {COLLECTION_QUERY_ID} from '~/queries/shopify/collection';
import stylesheet from '~/styles/tailwind.css';
import type {I18nLocale} from '~/types/shopify';

const seo: SeoHandleFunction<typeof loader> = ({data}) => ({
  title: data?.layout?.seo?.title,
  titleTemplate: `%s${
    data?.layout?.seo?.title ? ` · ${data?.layout?.seo?.title}` : ''
  }`,
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

export async function loader({context}: LoaderArgs) {
  const cache = context.storefront.CacheCustom({
    mode: 'public',
    maxAge: 60,
    staleWhileRevalidate: 60,
  });

  const preview = getPreview(context);

  const [cartId, shop, layout] = await Promise.all([
    context.session.get('cartId'),
    context.storefront.query<{shop: Shop}>(SHOP_QUERY),
    context.sanity.query<any>({query: LAYOUT_QUERY, cache}),
  ]);

  const selectedLocale = context.storefront.i18n as I18nLocale;

  return defer({
    preview,
    analytics: {
      shopifySalesChannel: ShopifySalesChannel.hydrogen,
      shopId: shop.shop.id,
    },
    cart: cartId ? getCart(context, cartId) : undefined,
    layout,
    notFoundCollection: layout?.notFoundPage?.collectionGid
      ? context.storefront.query<{collection: Collection}>(
          COLLECTION_QUERY_ID,
          {
            variables: {
              id: layout.notFoundPage.collectionGid,
              count: 16,
            },
          },
        )
      : undefined,
    sanityProjectID: context.env.SANITY_PROJECT_ID,
    sanityDataset: context.env.SANITY_DATASET,
    selectedLocale,
    storeDomain: context.storefront.getShopifyDomain(),
  });
}

export default function App() {
  const {preview, ...data} = useLoaderData<typeof loader>();
  const locale = data.selectedLocale ?? DEFAULT_LOCALE;
  const hasUserConsent = true;
  const nonce = useNonce();

  useAnalytics(hasUserConsent, locale);

  return (
    <html lang={locale.language}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Seo />
        <Meta />
        <Links />
      </head>
      <body>
        <PreviewProvider previewConfig={preview} fallback={<PreviewLoading />}>
          <Layout key={`${locale.language}-${locale.country}`}>
            <Outlet />
          </Layout>
        </PreviewProvider>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export function ErrorBoundary({error}: {error: Error}) {
  const [root] = useMatches();
  const nonce = useNonce();

  const routeError = useRouteError();
  const isRouteError = isRouteErrorResponse(routeError);

  const {
    selectedLocale: locale,
    layout,
    notFoundCollection,
  } = root.data
    ? root.data
    : {selectedLocale: DEFAULT_LOCALE, layout: null, notFoundCollection: {}};
  const {notFoundPage} = layout || {};

  let title = 'Error';
  if (isRouteError) {
    title = 'Not found';
  }

  return (
    <html lang={locale.language}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>{title}</title>
        <Meta />
        <Links />
      </head>
      <body>
        <Layout
          key={`${locale.language}-${locale.country}`}
          backgroundColor={notFoundPage?.colorTheme?.background}
        >
          {isRouteError ? (
            <>
              {routeError.status === 404 ? (
                <NotFound
                  notFoundPage={notFoundPage}
                  notFoundCollection={notFoundCollection}
                />
              ) : (
                <GenericError
                  error={{message: `${routeError.status} ${routeError.data}`}}
                />
              )}
            </>
          ) : (
            <GenericError error={error instanceof Error ? error : undefined} />
          )}
        </Layout>
        <Scripts nonce={nonce} />
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
