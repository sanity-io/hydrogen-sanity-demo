import {OptionWithValues, useProductOptions} from '@shopify/hydrogen';
import type {SanityCustomProductOption} from '../../../types';
import ProductOptionsColor from './ProductOptionsColor.client';
import ProductOptionsDefault from './ProductOptionsDefault.client';
import ProductOptionsSize from './ProductOptionsSize.client';

/**
 * A client component that tracks a selected variant and/or selling plan state, as well as callbacks for modifying the state
 */

type Props = {
  customProductOptions?: SanityCustomProductOption[];
};

export default function ProductOptions({customProductOptions}: Props) {
  const {options} = useProductOptions();

  return (
    <>
      <div>
        {(options as OptionWithValues[])?.map(({name, values}) => {
          // Check if current product has a valid custom option type.
          // If so, render a custom option component.
          const customProductOption = customProductOptions?.find(
            (option) => option.title === name,
          );

          switch (customProductOption?._type) {
            case 'customProductOption.color':
              return (
                <ProductOptionsColor
                  customProductOption={customProductOption}
                  key={name}
                  name={name}
                  values={values}
                />
              );
            case 'customProductOption.size':
              return (
                <ProductOptionsSize
                  customProductOption={customProductOption}
                  key={name}
                  name={name}
                  values={values}
                />
              );
            default:
              return (
                <ProductOptionsDefault key={name} name={name} values={values} />
              );
          }
        })}
      </div>

      <div className="my-4 w-full border-b border-gray" />
    </>
  );
}
