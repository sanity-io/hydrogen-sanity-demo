import {
  Link,
  useLocation,
  useNavigation,
  useSearchParams,
} from '@remix-run/react';
import {
  ProductOption,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';
import Tippy from '@tippyjs/react/headless';
import clsx from 'clsx';
import {forwardRef} from 'react';

import Tooltip from '~/components/elements/Tooltip';
import type {SanityCustomProductOption} from '~/lib/sanity';

export default function ProductOptions({
  options,
  selectedVariant,
  customProductOptions,
}: {
  options: ProductOption[];
  selectedVariant: ProductVariant;
  customProductOptions?: SanityCustomProductOption[];
}) {
  const {pathname, search} = useLocation();
  const [currentSearchParams] = useSearchParams();
  const navigation = useNavigation();

  const paramsWithDefaults = (() => {
    const defaultParams = new URLSearchParams(currentSearchParams);

    if (!selectedVariant) {
      return defaultParams;
    }

    for (const {name, value} of selectedVariant.selectedOptions) {
      if (!currentSearchParams.has(name)) {
        defaultParams.set(name, value);
      }
    }

    return defaultParams;
  })();

  // Update the in-flight request data from the 'navigation' (if available)
  // to create an optimistic UI that selects a link before the request is completed
  const searchParams = navigation.location
    ? new URLSearchParams(navigation.location.search)
    : paramsWithDefaults;

  return (
    <div className="grid gap-4">
      {/* Each option will show a label and option value <Links> */}
      {options.map((option) => {
        if (!option.values.length) {
          return;
        }
        // get the currently selected option value
        const currentOptionVal = searchParams.get(option.name);

        // Check if current product has a valid custom option type.
        // If so, render a custom option component.
        const customProductOption = customProductOptions?.find(
          (customOption) => customOption.title === option.name,
        );

        return (
          <div key={option.name}>
            <legend className="mb-2 text-xs text-darkGray">
              {option.name}
            </legend>

            <div className="flex flex-wrap items-center gap-1">
              {option.values.map((value) => {
                const linkParams = new URLSearchParams(searchParams);
                const isSelected = currentOptionVal === value;
                linkParams.set(option.name, value);

                const id = `option-${option.name}-${value}`;

                switch (customProductOption?._type) {
                  case 'customProductOption.color': {
                    const foundCustomOptionValue =
                      customProductOption.colors.find(
                        (color) => color.title === value,
                      );

                    return (
                      <Tippy
                        placement="top"
                        render={() => {
                          if (!foundCustomOptionValue) {
                            return null;
                          }
                          return (
                            <Tooltip label={foundCustomOptionValue.title} />
                          );
                        }}
                        key={id}
                      >
                        <ColorButton
                          to={`${pathname}?${linkParams.toString()}`}
                          isSelected={isSelected}
                          hex={foundCustomOptionValue?.hex || '#fff'}
                        />
                      </Tippy>
                    );
                  }
                  case 'customProductOption.size': {
                    const foundCustomOptionValue =
                      customProductOption.sizes.find(
                        (size) => size.title === value,
                      );

                    return (
                      <Tippy
                        placement="top"
                        render={() => {
                          if (!foundCustomOptionValue) {
                            return null;
                          }
                          return (
                            <Tooltip
                              label={`${foundCustomOptionValue.width}cm x ${foundCustomOptionValue.height}cm`}
                            />
                          );
                        }}
                        key={id}
                      >
                        <OptionButton
                          to={`${pathname}?${linkParams.toString()}`}
                          isSelected={isSelected}
                        >
                          {value}
                        </OptionButton>
                      </Tippy>
                    );
                  }
                  default:
                    return (
                      <OptionButton
                        to={`${pathname}?${linkParams.toString()}`}
                        isSelected={isSelected}
                        key={id}
                      >
                        {value}
                      </OptionButton>
                    );
                }
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const OptionButton = forwardRef<
  HTMLAnchorElement,
  {to: string; isSelected: boolean; children: React.ReactNode}
>((props, ref) => {
  const {to, isSelected, children} = props;

  return (
    <Link
      ref={ref}
      to={to}
      preventScrollReset
      replace
      className={clsx([
        'cursor-pointer rounded-[6px] border px-3 py-2 text-sm leading-none',
        isSelected
          ? 'border-black text-black'
          : 'border-lightGray text-darkGray',
      ])}
    >
      {children}
    </Link>
  );
});

const ColorButton = forwardRef<
  HTMLAnchorElement,
  {to: string; hex: string; isSelected: boolean}
>((props, ref) => {
  const {to, hex, isSelected} = props;

  return (
    <Link
      ref={ref}
      to={to}
      preventScrollReset
      replace
      className={clsx([
        'flex h-8 w-8 items-center justify-center rounded-full border',
        isSelected
          ? 'border-offBlack'
          : 'cursor-pointer border-transparent hover:border-black hover:border-opacity-30',
      ])}
    >
      <div
        className="rounded-full"
        style={{
          background: hex,
          height: 'calc(100% - 4px)',
          width: 'calc(100% - 4px)',
        }}
      ></div>
    </Link>
  );
});
