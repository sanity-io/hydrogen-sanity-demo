import {useProduct} from '@shopify/hydrogen/client';
import type {SanityCustomProductOption} from '../types';
import DebugWrapper from './DebugWrapper';
import ProductOptionsColor from './ProductOptionsColor.client';
import ProductOptionsDefault from './ProductOptionsDefault.client';

/**
 * A client component that tracks a selected variant and/or selling plan state, as well as callbacks for modifying the state
 */

type Props = {
  customProductOptions?: SanityCustomProductOption[];
};

export default function ProductOptions({customProductOptions}: Props) {
  const {options} = useProduct();

  return (
    <DebugWrapper name="Product Options" shopify>
      {options?.map(({name, values}) => {
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
                name={name}
                values={values}
              />
            );
          default:
            return <ProductOptionsDefault name={name} values={values} />;
        }
      })}
    </DebugWrapper>
  );
}
