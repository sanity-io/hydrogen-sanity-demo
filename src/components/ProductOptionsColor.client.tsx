import {useProduct} from '@shopify/hydrogen';
import clsx from 'clsx';
import {SanityCustomProductOptionColor} from '../types';

/**
 * A client component that tracks a selected variant and/or selling plan state, as well as callbacks for modifying the state
 */

type Props = {
  customProductOption: SanityCustomProductOptionColor;
  name: string;
  values: string[];
};

const ColorSwatch = ({hex, selected}: {hex: string; selected: boolean}) => {
  return (
    <>
      <div
        className={clsx([
          'flex h-8 w-8 items-center justify-center rounded-full border',
          selected ? 'border-black' : 'cursor-pointer border-transparent',
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
      </div>
    </>
  );
};

export default function ProductOptionsColor({
  customProductOption,
  name,
  values,
}: Props) {
  const {setSelectedOption, selectedOptions} = useProduct();

  const handleChange = (optionName: string, optionValue: string) => {
    if (setSelectedOption) {
      setSelectedOption(optionName, optionValue);
    }
  };

  return (
    <fieldset key={name} className="mt-4">
      <div className="flex flex-wrap items-center gap-2">
        {values.map((value) => {
          const selected = selectedOptions?.[name] === value;
          const id = `option-${name}-${value}`;

          const foundCustomOptionValue = customProductOption.colors.find(
            (color) => color.title === value,
          );

          return (
            <label key={id} htmlFor={id}>
              <input
                className="sr-only"
                type="radio"
                id={id}
                name={`option[${name}]`}
                value={value}
                checked={selected}
                onChange={() => handleChange(name, value)}
              />

              {foundCustomOptionValue ? (
                <ColorSwatch
                  hex={foundCustomOptionValue.hex}
                  selected={selected}
                />
              ) : (
                <div
                  className={`cursor-pointer border p-2 text-sm ${
                    selected ? 'bg-gray text-white' : 'text-gray'
                  }`}
                >
                  {value}
                </div>
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
