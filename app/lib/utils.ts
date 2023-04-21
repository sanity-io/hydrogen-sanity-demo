import {useMatches} from '@remix-run/react';
import type {
  Collection,
  Product,
  ProductOption,
} from '@shopify/hydrogen/storefront-api-types';
import type {AppLoadContext} from '@shopify/remix-oxygen';
import {json, type LoaderArgs} from '@shopify/remix-oxygen';
import {reduceDeep} from 'deepdash-es/standalone';
import pluralize from 'pluralize-esm';

import {countries} from '~/data/countries';
import type {SanityModule} from '~/lib/sanity';
import type {
  SanityCollectionPage,
  SanityHomePage,
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

/**
 * Get data from Shopify for page components
 */

type StorefrontPayload = {
  products: Product[];
  collections: Collection[];
};

export const getStorefrontData = async ({
  page,
  context,
}: {
  page: SanityHomePage | SanityPage | SanityCollectionPage | SanityProductPage;
  context: AppLoadContext;
}) => {
  const [productGids, collectionGids] = reduceDeep(
    page,
    (acc, value) => {
      if (value?._type == 'productWithVariant') {
        acc[0].push(value.gid);
      }
      if (value?._type == 'collection') {
        acc[1].push(value.gid);
      }
      return acc;
    },
    [[], []],
  );

  const {products, collections}: StorefrontPayload =
    await context.storefront.query<any>(PRODUCTS_AND_COLLECTIONS, {
      variables: {
        ids: productGids,
        collectionIds: collectionGids,
      },
    });

  return {
    products,
    collections,
  };
};

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
 * Validates that a url is local
 * @param url
 * @returns `true` if local `false`if external domain
 */
export function isLocalPath(url: string) {
  try {
    // We don't want to redirect cross domain,
    // doing so could create fishing vulnerability
    // If `new URL()` succeeds, it's a fully qualified
    // url which is cross domain. If it fails, it's just
    // a path, which will be the current domain.
    new URL(url);
  } catch (e) {
    return true;
  }

  return false;
}
