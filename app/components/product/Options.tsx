import {Link} from '@remix-run/react';
import {VariantSelector} from '@shopify/hydrogen';
import {
  Product,
  ProductOption,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';
import Tippy from '@tippyjs/react/headless';
import clsx from 'clsx';
import {forwardRef} from 'react';

import Tooltip from '~/components/elements/Tooltip';
import type {SanityCustomProductOption} from '~/lib/sanity';

export default function ProductOptions({
  product,
  variants,
  options,
  selectedVariant,
  customProductOptions,
}: {
  product: Product;
  variants: ProductVariant[];
  options: ProductOption[];
  selectedVariant: ProductVariant;
  customProductOptions?: SanityCustomProductOption[];
}) {
  return (
    <div className="grid gap-4">
      {/* Each option will show a label and option value <Links> */}
      <VariantSelector
        handle={product.handle}
        options={options}
        variants={variants}
      >
        {({option}) => {
          // Check if current product has a valid custom option type.
          // If so, render a custom option component.
          const customProductOption = customProductOptions?.find(
            (customOption) => customOption.title === option.name,
          );

          return (
            <div>
              <legend className="mb-2 text-xs text-darkGray">
                {option.name}
              </legend>
              <div className="flex flex-wrap items-center gap-1">
                {option.values.map(({value, to, isActive, isAvailable}) => {
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
                            to={to}
                            isSelected={isActive}
                            isAvailable={isAvailable}
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
                            to={to}
                            isSelected={isActive}
                            isAvailable={isAvailable}
                          >
                            {value}
                          </OptionButton>
                        </Tippy>
                      );
                    }
                    default:
                      return (
                        <OptionButton
                          to={to}
                          isSelected={isActive}
                          key={id}
                          isAvailable={isAvailable}
                        >
                          {value}
                        </OptionButton>
                      );
                  }
                })}
              </div>
            </div>
          );
        }}
      </VariantSelector>
    </div>
  );
}

const OptionButton = forwardRef<
  HTMLAnchorElement,
  {
    to: string;
    isSelected: boolean;
    isAvailable: boolean;
    children: React.ReactNode;
  }
>((props, ref) => {
  const {to, isSelected, children, isAvailable} = props;

  return (
    <Link
      ref={ref}
      to={to}
      preventScrollReset
      replace
      prefetch="intent"
      className={clsx([
        'cursor-pointer rounded-[6px] border px-3 py-2 text-sm leading-none',
        isSelected
          ? 'border-black text-black'
          : 'border-lightGray text-darkGray',
        !isAvailable && 'opacity-80',
      ])}
    >
      {children}
    </Link>
  );
});

const ColorButton = forwardRef<
  HTMLAnchorElement,
  {to: string; hex: string; isSelected: boolean; isAvailable: boolean}
>((props, ref) => {
  const {to, hex, isSelected, isAvailable} = props;

  return (
    <Link
      ref={ref}
      to={to}
      preventScrollReset
      replace
      prefetch="intent"
      className={clsx([
        'flex h-8 w-8 items-center justify-center rounded-full border',
        isSelected
          ? 'border-offBlack'
          : 'cursor-pointer border-transparent hover:border-black hover:border-opacity-30',
        !isAvailable && 'opacity-80',
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
