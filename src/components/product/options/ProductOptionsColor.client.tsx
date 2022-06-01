import {useProduct} from '@shopify/hydrogen';
import Tippy from '@tippyjs/react/headless';
import clsx from 'clsx';
import {SanityCustomProductOptionColor} from '../../../types';
import ButtonOption from '../../buttons/ButtonOption';
import Tooltip from '../../Tooltip';

/**
 * A client component that tracks a selected variant and/or selling plan state, as well as callbacks for modifying the state
 */

type Props = {
  customProductOption: SanityCustomProductOptionColor;
  name: string;
  values: string[];
};

const ColorChip = ({hex, selected}: {hex: string; selected: boolean}) => {
  return (
    <>
      <div
        className={clsx([
          'flex h-8 w-8 items-center justify-center rounded-full border',
          selected
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
      {/* Name */}
      <legend className="mb-2 text-xs text-darkGray">{name}</legend>

      <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
        {values.map((value) => {
          const checked = selectedOptions?.[name] === value;
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
                checked={checked}
                onChange={() => handleChange(name, value)}
              />

              {/* Display a tooltip only if we're displaying color chips */}
              {foundCustomOptionValue ? (
                <Tippy
                  placement="top"
                  render={() => (
                    <Tooltip label={foundCustomOptionValue.title} />
                  )}
                >
                  {/* Tippy requires a wrapping element! */}
                  <div>
                    <ColorChip
                      hex={foundCustomOptionValue.hex}
                      selected={checked}
                    />
                  </div>
                </Tippy>
              ) : (
                <ButtonOption checked={checked} label={value} />
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
