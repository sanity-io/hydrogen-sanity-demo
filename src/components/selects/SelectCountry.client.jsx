import {Listbox} from '@headlessui/react';
import {fetchSync, useCountry} from '@shopify/hydrogen';
import clsx from 'clsx';
import {Suspense, useCallback, useState} from 'react';
import {IconChevronDown} from '../icons/IconChevronDown';
import IconRadio from '../icons/IconRadio';
import SpinnerIcon from '../icons/IconSpinner';

/**
 * A client component that selects the appropriate country to display for products on a website
 */
export default function CountrySelector() {
  const [listboxOpen, setListboxOpen] = useState(false);
  const [selectedCountry] = useCountry();

  const setCountry = useCallback(({isoCode, name}) => {
    fetch(`/api/countries`, {
      body: JSON.stringify({isoCode, name}),
      method: 'POST',
    }).then(() => {
      window.location.reload();
    });
  }, []);

  return (
    <Listbox onChange={setCountry}>
      {({open}) => {
        setTimeout(() => setListboxOpen(open));
        return (
          <div className="relative inline-flex">
            <Listbox.Button
              className={clsx(
                'flex h-[2.4rem] items-center rounded-sm bg-offBlack bg-opacity-0 p-2 text-sm font-bold duration-150',
                'hover:bg-opacity-5',
              )}
            >
              <span className="mr-2">{selectedCountry.name}</span>
              <IconChevronDown className={open ? 'rotate-180' : null} />
            </Listbox.Button>

            <Listbox.Options className="absolute top-full left-1/2 z-10 mt-3 min-w-[150px] -translate-x-1/2 overflow-hidden rounded shadow">
              <div className="max-h-64 overflow-y-auto bg-white">
                {listboxOpen && (
                  <Suspense
                    fallback={
                      <div className="flex justify-center overflow-hidden">
                        <SpinnerIcon />
                      </div>
                    }
                  >
                    <Countries
                      selectedCountry={selectedCountry}
                      getClassName={(active) => {
                        return clsx([
                          'p-3 flex justify-between items-center text-left font-bold text-sm cursor-pointer whitespace-nowrap',
                          active ? 'bg-darkGray bg-opacity-5' : null,
                        ]);
                      }}
                    />
                  </Suspense>
                )}
              </div>
            </Listbox.Options>
          </div>
        );
      }}
    </Listbox>
  );
}

export function Countries({selectedCountry, getClassName}) {
  const countries = fetchSync('/api/countries').json();

  return countries.map((country) => {
    const isSelected = country.isoCode === selectedCountry.isoCode;
    return (
      <Listbox.Option key={country.isoCode} value={country}>
        {({active}) => (
          <div className={getClassName(active)}>
            <span className="mr-8">{country.name}</span>
            <IconRadio checked={isSelected} hovered={active} />
          </div>
        )}
      </Listbox.Option>
    );
  });
}
