import {useAsyncValue, useFetcher, useMatches} from '@remix-run/react';
import {extract} from '@sanity/mutator';
import type {
  Collection,
  Product,
  ProductOption,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';
import {
  type AppLoadContext,
  json,
  type LoaderArgs,
} from '@shopify/remix-oxygen';
import {usePreviewContext} from 'hydrogen-sanity';
import pluralize from 'pluralize-esm';
import {useEffect, useMemo, useRef} from 'react';

import {countries} from '~/data/countries';
import type {
  SanityCollectionPage,
  SanityHomePage,
  SanityModule,
  SanityPage,
  SanityProductPage,
} from '~/lib/sanity';
import {PRODUCTS_AND_COLLECTIONS} from '~/queries/shopify/product';
import type {I18nLocale} from '~/types/shopify';

export const DEFAULT_LOCALE: I18nLocale = Object.freeze({
  ...countries.default,
  pathPrefix: '',
});

export function getLocaleFromRequest(request: Request): I18nLocale {
  const url = new URL(request.url);
  const firstPathPart =
    '/' + url.pathname.substring(1).split('/')[0].toLowerCase();

  return countries[firstPathPart]
    ? {
        ...countries[firstPathPart],
        pathPrefix: firstPathPart,
      }
    : {
        ...countries['default'],
        pathPrefix: '',
      };
}

export function usePrefixPathWithLocale(path: string) {
  const [root] = useMatches();
  const selectedLocale = root.data?.selectedLocale ?? DEFAULT_LOCALE;

  return `${selectedLocale.pathPrefix}${
    path.startsWith('/') ? path : '/' + path
  }`;
}

export function validateLocale({
  params,
  context,
}: {
  context: LoaderArgs['context'];
  params: LoaderArgs['params'];
}) {
  const {language, country} = context.storefront.i18n;
  if (
    params.lang &&
    params.lang.toLowerCase() !== `${language}-${country}`.toLowerCase()
  ) {
    // If the lang URL param is defined, and it didn't match a valid localization,
    // then the lang param must be invalid, send to the 404 page
    throw notFound();
  }
}

/**
 * Errors can exist in an errors object, or nested in a data field.
 */
export function assertApiErrors(data: Record<string, any> | null | undefined) {
  const errorMessage = data?.customerUserErrors?.[0]?.message;
  if (errorMessage) {
    throw new Error(errorMessage);
  }
}

/**
 * Map Shopify order status to a human-readable string
 */
export function statusMessage(status: string) {
  const translations: Record<string, string> = {
    ATTEMPTED_DELIVERY: 'Attempted delivery',
    CANCELED: 'Canceled',
    CONFIRMED: 'Confirmed',
    DELIVERED: 'Delivered',
    FAILURE: 'Failure',
    FULFILLED: 'Fulfilled',
    IN_PROGRESS: 'In Progress',
    IN_TRANSIT: 'In transit',
    LABEL_PRINTED: 'Label printed',
    LABEL_PURCHASED: 'Label purchased',
    LABEL_VOIDED: 'Label voided',
    MARKED_AS_FULFILLED: 'Marked as fulfilled',
    NOT_DELIVERED: 'Not delivered',
    ON_HOLD: 'On Hold',
    OPEN: 'Open',
    OUT_FOR_DELIVERY: 'Out for delivery',
    PARTIALLY_FULFILLED: 'Partially Fulfilled',
    PENDING_FULFILLMENT: 'Pending',
    PICKED_UP: 'Displayed as Picked up',
    READY_FOR_PICKUP: 'Ready for pickup',
    RESTOCKED: 'Restocked',
    SCHEDULED: 'Scheduled',
    SUBMITTED: 'Submitted',
    UNFULFILLED: 'Unfulfilled',
  };
  try {
    return translations?.[status];
  } catch (error) {
    return status;
  }
}

/**
 * Combine products and modules into a single array, with modules inserted at
 * regular intervals.
 */
const MODULE_INTERVAL = 2;
const START_INDEX = 2;

export function combineProductsAndModules({
  modules,
  products,
}: {
  products: Product[];
  modules?: SanityModule[];
}) {
  let moduleIndex = 0;
  return products.reduce<(SanityModule | Product)[]>((acc, val, index) => {
    if (index >= START_INDEX && index % MODULE_INTERVAL === 0) {
      const nextModule = modules?.[moduleIndex];
      if (nextModule) {
        acc.push(nextModule);
        moduleIndex += 1;
      }
    }
    acc.push(val);
    return acc;
  }, []);
}

/**
 * Check if a product has multiple options, e.g. Color / Size / Title
 */

export const hasMultipleProductOptions = (options?: ProductOption[]) => {
  const firstOption = options?.[0];
  if (!firstOption) {
    return false;
  }

  return (
    firstOption.name !== 'Title' && firstOption.values[0] !== 'Default Title'
  );
};

/**
 * Get the product options as a string, e.g. "Color / Size / Title"
 */
export const getProductOptionString = (options?: ProductOption[]) => {
  return options
    ?.map(({name, values}) => pluralize(name, values.length, true))
    .join(' / ');
};

type StorefrontPayload = {
  productsAndCollections: Product[] | Collection[];
};

/**
 * Get data from Shopify for page components
 */
export async function fetchGids({
  page,
  context,
}: {
  page: SanityHomePage | SanityPage | SanityCollectionPage | SanityProductPage;
  context: AppLoadContext;
}) {
  const productGids = extract(`..[_type == "productWithVariant"].gid`, page);
  const collectionGids = extract(`..[_type == "collection"].gid`, page);

  const {productsAndCollections} =
    await context.storefront.query<StorefrontPayload>(
      PRODUCTS_AND_COLLECTIONS,
      {
        variables: {
          ids: [...productGids, ...collectionGids],
        },
      },
    );

  return extract(`..[id?]`, productsAndCollections) as (
    | Product
    | Collection
    | ProductVariant
  )[];
}

// TODO: better typing?
export function useGid<
  T extends Product | Collection | ProductVariant | ProductVariant['image'],
>(id?: string | null): T | null | undefined {
  const gids = useRef(useGids());
  const fetcher = useFetcher();
  const isPreview = Boolean(usePreviewContext());
  const [root] = useMatches();
  const selectedLocale = root.data?.selectedLocale;

  const gid = useRef(gids.current.get(id as string) as T | null);

  // In preview mode, if a product or collection is added
  // then the fetcher is used to fetch the new data from
  // the Storefront API
  useEffect(() => {
    if (isPreview && !gid.current && id) {
      const apiUrl = `${
        selectedLocale && `${selectedLocale.pathPrefix}`
      }/api/fetchgids`;
      if (fetcher.state === 'idle' && fetcher.data == null) {
        fetcher.submit(
          {ids: JSON.stringify([id])},
          {method: 'post', action: apiUrl},
        );
      }

      if (fetcher.data) {
        const newGids = fetcher.data as (
          | Product
          | Collection
          | ProductVariant
        )[];

        if (!Array.isArray(newGids)) {
          return;
        }

        for (const newGid of newGids) {
          if (gids.current.has(newGid.id)) {
            continue;
          }

          gids.current.set(newGid.id, newGid);
        }

        gid.current = gids.current.get(id as string) as T | null;
      }
    }
  }, [gids, id, isPreview, fetcher, selectedLocale]);

  return gid.current;
}

export function useGids() {
  const gids = useAsyncValue();

  // TODO: this doesnt' seem to actually memoize...
  return useMemo(() => {
    const byGid = new Map<
      string,
      Product | Collection | ProductVariant | ProductVariant['image']
    >();

    if (!Array.isArray(gids)) {
      return byGid;
    }

    for (const gid of gids) {
      if (byGid.has(gid.id)) {
        continue;
      }

      byGid.set(gid.id, gid);
    }

    return byGid;
  }, [gids]);
}

/**
 * A not found response. Sets the status code.
 */
export const notFound = (message = 'Not Found') =>
  new Response(message, {
    status: 404,
    statusText: 'Not Found',
  });

/**
 * A bad request response. Sets the status code and response body
 */
export const badRequest = <T>(data: T) =>
  json(data, {status: 400, statusText: 'Bad Request'});

/**
 * Validates that a url is local to the current request.
 */
export function isLocalPath(request: Request, url: string) {
  // Our domain, based on the current request path
  const currentUrl = new URL(request.url);

  // If url is relative, the 2nd argument will act as the base domain.
  const urlToCheck = new URL(url, currentUrl.origin);

  // If the origins don't match the slug is not on our domain.
  return currentUrl.origin === urlToCheck.origin;
}
