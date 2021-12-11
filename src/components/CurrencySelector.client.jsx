import {Fragment, useCallback} from 'react';
import {useAvailableCountries, useCountry} from '@shopify/hydrogen/client';
import {Listbox, Transition} from '@headlessui/react';

export default function CurrencySelector() {

  const countries = useAvailableCountries();
  const [selectedCountry, setSelectedCountry] = useCountry();

  const setCountry = useCallback(
    (isoCode) => {
      setSelectedCountry(
        countries.find((country) => country.isoCode === isoCode),
      );
    },
    [countries, setSelectedCountry],
  );

  if (countries.length === 1) {
    return <></>
  }

  return (
    <div className="relative">
      <Listbox value={selectedCountry} onChange={setCountry}>
        {({open}) => (
          <>
            <Listbox.Button>{selectedCountry.currency.isoCode}</Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute -mt-2 -ml-2 border border-black -top-px -left-px bg-offWhite">
                {countries.map((country) => {
                  const isSelected =
                    country.isoCode === selectedCountry.isoCode;
                  return (
                    <Listbox.Option
                      key={country.isoCode}
                      value={country.isoCode}
                    >
                      {({active}) => (
                        <div
                          className={`p-2 flex justify-between items-center text-left w-full cursor-pointer ${
                            isSelected ? 'font-medium' : null
                          } ${active ? 'bg-paleGreen' : null}`}
                        >
                          <span className="mr-1">
                            {country.currency.isoCode}
                          </span>
                          {isSelected ? <CheckIcon /> : null}
                        </div>
                      )}
                    </Listbox.Option>
                  );
                })}
              </Listbox.Options>
            </Transition>
          </>
        )}
      </Listbox>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="10"
      height="8"
      viewBox="0 0 10 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.11043 3.56068L3.23175 5.682L3.93885 6.38911L3.23175 7.09621L0.40332 4.26779L1.11043 3.56068Z"
        fill="#181806"
      />
      <path
        d="M8.8886 0.0251465L9.59571 0.732253L3.23175 7.09621L2.52464 6.38911L3.23175 5.682L8.8886 0.0251465Z"
        fill="#181806"
      />
    </svg>
  );
}
