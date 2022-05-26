import {useCallback, useState, Suspense} from 'react';
import {useCountry, fetchSync} from '@shopify/hydrogen';
import {Listbox} from '@headlessui/react';
import SpinnerIcon from './SpinnerIcon.client';
import RadioIcon from './RadioIcon.client';
import clsx from 'clsx';

/**
 * A client component that selects the appropriate country to display for products on a website
 */
export default function CountrySelector() {
  const [listboxOpen, setListboxOpen] = useState(false);
  const [selectedCountry] = useCountry();

  const setCountry = useCallback(({isoCode, name}) => {
    fetch(`/countries`, {
      body: JSON.stringify({isoCode, name}),
      method: 'POST',
    }).then(() => {
      window.location.reload();
    });
  }, []);

  return (
    <div className="relative hidden lg:block">
      <Listbox onChange={setCountry}>
        {({open}) => {
          setTimeout(() => setListboxOpen(open));
          return (
            <>
              <Listbox.Button className="flex items-center p-2 text-sm font-bold">
                <span className="mr-2">{selectedCountry.name}</span>
                <ArrowIcon className={open ? 'rotate-180' : null} />
              </Listbox.Button>

              <Listbox.Options className="absolute left-1/2 z-10 min-w-[150px] -translate-x-1/2 overflow-hidden rounded shadow">
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
                            active ? 'bg-lightGray' : null,
                          ]);
                        }}
                      />
                    </Suspense>
                  )}
                </div>
              </Listbox.Options>
            </>
          );
        }}
      </Listbox>
    </div>
  );
}

export function Countries({selectedCountry, getClassName}) {
  const countries = fetchSync('/countries').json();

  return countries.map((country) => {
    const isSelected = country.isoCode === selectedCountry.isoCode;
    return (
      <Listbox.Option key={country.isoCode} value={country}>
        {({active}) => (
          <div className={getClassName(active)}>
            <span className="mr-8">{country.name}</span>
            <RadioIcon checked={isSelected} />
          </div>
        )}
      </Listbox.Option>
    );
  });
}

export function ArrowIcon({className}) {
  return (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.75 4.5L6 8.25L2.25 4.5"
        stroke="#3A3E3E"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
