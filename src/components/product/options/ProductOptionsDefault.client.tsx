import {useProductOptions} from '@shopify/hydrogen';
import OptionButton from '../../elements/OptionButton';

/**
 * A client component that tracks a selected variant and/or selling plan state, as well as callbacks for modifying the state
 */

type Props = {
  name: string;
  values: string[];
};

export default function ProductOptionsDefault({name, values}: Props) {
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

      <div className="flex flex-wrap items-center gap-2">
        {values.map((value) => {
          const checked = selectedOptions?.[name] === value;
          const id = `option-${name}-${value}`;

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
              <OptionButton checked={checked} label={value} />
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
