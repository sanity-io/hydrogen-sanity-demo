import {useProductOptions} from '@shopify/hydrogen';
// @ts-expect-error incompatibility with node16 resolution
import Tippy from '@tippyjs/react/headless';
import type {SanityCustomProductOptionSize} from '../../../types';
import OptionButton from '../../elements/OptionButton';
import Tooltip from '../../elements/Tooltip';

/**
 * A client component that tracks a selected variant and/or selling plan state, as well as callbacks for modifying the state
 */

type Props = {
  customProductOption: SanityCustomProductOptionSize;
  name: string;
  values: string[];
};

export default function ProductOptionsColor({
  customProductOption,
  name,
  values,
}: Props) {
  const {setSelectedOption, selectedOptions} = useProductOptions();

  const handleChange = (optionName: string, optionValue: string) => {
    if (setSelectedOption) {
      setSelectedOption(optionName, optionValue);
    }
  };

  return (
    <fieldset key={name} className="mt-4">
      {/* Name */}
      <legend className="mb-2 text-xs text-darkGray">{name}</legend>

      <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
        {values.map((value) => {
          const checked = selectedOptions?.[name] === value;
          const id = `option-${name}-${value}`;

          const foundCustomOptionValue = customProductOption.sizes.find(
            (size) => size.title === value,
          );

          return (
            <label key={id} htmlFor={id}>
              <input
                className="sr-only"
                type="radio"
                id={id}
                name={`option[${name}]`}
                value={value}
                checked={checked}
                onChange={() => handleChange(name, value)}
              />

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
              >
                {/* Tippy requires a wrapping element! */}
                <div>
                  <OptionButton checked={checked} label={value} />
                </div>
              </Tippy>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
