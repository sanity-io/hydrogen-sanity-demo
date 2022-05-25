import {useCallback, useState, Suspense} from 'react';
import {useCountry, fetchSync} from '@shopify/hydrogen';
import {Listbox} from '@headlessui/react';
import SpinnerIcon from './SpinnerIcon.client';

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
                          return `p-3 flex justify-between items-center text-left font-bold text-sm cursor-pointer whitespace-nowrap ${
                            active ? 'text-gray' : null
                          }`;
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
            {country.name}
            <svg
              className="ml-8"
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isSelected ? (
                <>
                  <path
                    d="M0 10.5C0 4.70101 4.70101 0 10.5 0C16.299 0 21 4.70101 21 10.5C21 16.299 16.299 21 10.5 21C4.70101 21 0 16.299 0 10.5Z"
                    fill="#1147E0"
                  />
                  <path
                    d="M15.6562 7.21875L9.09375 13.7812L5.8125 10.5"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              ) : (
                <>
                  <path
                    d="M10.5 20.5C4.97715 20.5 0.5 16.0228 0.5 10.5C0.5 4.97715 4.97715 0.5 10.5 0.5C16.0228 0.5 20.5 4.97715 20.5 10.5C20.5 16.0228 16.0228 20.5 10.5 20.5Z"
                    fill="white"
                  />
                  <path
                    d="M10.5 20.5C4.97715 20.5 0.5 16.0228 0.5 10.5C0.5 4.97715 4.97715 0.5 10.5 0.5C16.0228 0.5 20.5 4.97715 20.5 10.5C20.5 16.0228 16.0228 20.5 10.5 20.5Z"
                    stroke="#E7E7E7"
                  />
                </>
              )}
            </svg>
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
