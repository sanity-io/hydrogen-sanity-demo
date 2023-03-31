import {useMatches} from '@remix-run/react';
import {LoaderArgs} from '@shopify/remix-oxygen';

import {countries} from '~/data/countries';
import {type I18nLocale} from '~/types/shopify';

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
    throw new Response('Not found', {status: 404});
  }
}