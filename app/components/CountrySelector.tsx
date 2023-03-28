import {Form, useFetcher, useLocation, useMatches} from '@remix-run/react';
import {useEffect, useState} from 'react';

import {countries} from '~/data/countries';
import {DEFAULT_LOCALE} from '~/lib/utils';
import {Locale} from '~/types/shopify';

export function CountrySelector() {
  const [root] = useMatches();
  const selectedLocale = root.data?.selectedLocale ?? DEFAULT_LOCALE;
  const {pathname, search} = useLocation();
  const pathWithoutLocale = `${pathname.replace(
    selectedLocale.pathPrefix,
    '',
  )}${search}`;

  const defaultLocale = countries?.['default'];
  const defaultLocalePrefix = defaultLocale
    ? `${defaultLocale?.language}-${defaultLocale?.country}`
    : '';

  return (
    <details>
      <summary>{selectedLocale.label}</summary>
      <div className="bg-contrast max-h-36 w-full overflow-auto border-t py-2">
        {countries &&
          Object.keys(countries).map((countryKey) => {
            const countryLocale = countries[countryKey];

            const countryUrlPath = getCountryUrlPath({
              countryLocale,
              defaultLocalePrefix,
              pathWithoutLocale,
            });

            return (
              <Form method="post" action="/locale" key={countryUrlPath}>
                <input
                  type="hidden"
                  name="language"
                  value={countryLocale.language}
                />
                <input
                  type="hidden"
                  name="country"
                  value={countryLocale.country}
                />
                <input type="hidden" name="path" value={`${countryUrlPath}`} />
                <button type="submit">{countryLocale.label}</button>
              </Form>
            );
          })}
      </div>
    </details>
  );
}

function getCountryUrlPath({
  countryLocale,
  defaultLocalePrefix,
  pathWithoutLocale,
}: {
  countryLocale: Locale;
  pathWithoutLocale: string;
  defaultLocalePrefix: string;
}) {
  let countryPrefixPath = '';
  const countryLocalePrefix = `${countryLocale.language}-${countryLocale.country}`;

  if (countryLocalePrefix !== defaultLocalePrefix) {
    countryPrefixPath = `/${countryLocalePrefix.toLowerCase()}`;
  }
  return `${countryPrefixPath}${pathWithoutLocale}`;
}
