import {Listbox} from '@headlessui/react';
import {useFetcher, useLocation, useMatches} from '@remix-run/react';
import clsx from 'clsx';
import {useState} from 'react';
import invariant from 'tiny-invariant';

import {ChevronDownIcon} from '~/components/icons/ChevronDown';
import RadioIcon from '~/components/icons/Radio';
import {countries} from '~/data/countries';
import {DEFAULT_LOCALE} from '~/lib/utils';
import {CartAction, type Locale} from '~/types/shopify';

type Props = {
  align?: 'center' | 'left' | 'right';
};

export function CountrySelector({align = 'center'}: Props) {
  const fetcher = useFetcher();

  const [listboxOpen, setListboxOpen] = useState(false);

  const fetcherLocaleLabel = fetcher?.formData?.get('label');

  const [root] = useMatches();
  const selectedLocale = root.data?.selectedLocale ?? DEFAULT_LOCALE;
  const selectedLocalePrefix = `${selectedLocale?.language}-${selectedLocale?.country}`;
  const {pathname, search} = useLocation();
  const pathWithoutLocale = `${pathname.replace(
    selectedLocale.pathPrefix,
    '',
  )}${search}`;

  const defaultLocale = countries?.['default'];
  const defaultLocalePrefix = defaultLocale
    ? `${defaultLocale?.language}-${defaultLocale?.country}`
    : '';

  const setLocale = (newLocale: Locale) => {
    invariant(newLocale, 'newLocale is required');
    const newLocalePrefix = `${newLocale?.language}-${newLocale?.country}`;

    if (newLocalePrefix !== selectedLocalePrefix) {
      const countryUrlPath = getCountryUrlPath({
        countryLocale: newLocale,
        defaultLocalePrefix,
        pathWithoutLocale,
      });

      fetcher.submit(
        {
          cartAction: CartAction.UPDATE_BUYER_IDENTITY,
          buyerIdentity: JSON.stringify({
            countryCode: newLocale.country,
          }),
          redirectTo: countryUrlPath,
        },
        {method: 'post', action: '/cart?index'},
      );
    }
  };

  return (
    <>
      <Listbox onChange={setLocale} value={selectedLocale}>
        {({open}: {open: boolean}) => {
          setTimeout(() => setListboxOpen(open));
          return (
            <div className="relative inline-flex">
              <Listbox.Button
                className={clsx(
                  'flex h-[2.4rem] items-center rounded-sm bg-darkGray bg-opacity-0 px-3 py-2 text-sm font-bold duration-150',
                  'hover:bg-opacity-10',
                )}
              >
                <span className="mr-2">
                  {fetcherLocaleLabel || selectedLocale.label}
                </span>
                <ChevronDownIcon className={clsx(open && 'rotate-180')} />
              </Listbox.Button>

              <Listbox.Options
                className={clsx(
                  'absolute top-full z-10 mt-3 min-w-[150px] overflow-hidden rounded shadow',
                  align === 'center' && 'left-1/2 -translate-x-1/2',
                  align === 'left' && 'left-0',
                  align === 'right' && 'right-0',
                )}
              >
                <div className="max-h-64 overflow-y-auto bg-white">
                  {listboxOpen && (
                    <Countries
                      selectedLocalePrefix={selectedLocalePrefix}
                      getClassName={(active: boolean) => {
                        return clsx([
                          'p-3 flex justify-between items-center text-left font-bold text-sm cursor-pointer whitespace-nowrap',
                          active ? 'bg-darkGray bg-opacity-5' : null,
                        ]);
                      }}
                    />
                  )}
                </div>
              </Listbox.Options>
            </div>
          );
        }}
      </Listbox>
    </>
  );
}

export function Countries({
  getClassName,
  selectedLocalePrefix,
}: {
  getClassName: (active: boolean) => string;
  selectedLocalePrefix: string;
}) {
  return (
    <>
      {Object.keys(countries).map((countryKey) => {
        const countryLocale = countries[countryKey];
        const countryLocalePrefix = `${countryLocale?.language}-${countryLocale?.country}`;
        const isSelected = countryLocalePrefix === selectedLocalePrefix;

        return (
          <Listbox.Option key={countryLocalePrefix} value={countryLocale}>
            {({active}: {active: boolean}) => (
              <div className={getClassName(active)}>
                <span className="mr-8">{countryLocale.label}</span>
                <RadioIcon checked={isSelected} hovered={active} />
              </div>
            )}
          </Listbox.Option>
        );
      })}
    </>
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
