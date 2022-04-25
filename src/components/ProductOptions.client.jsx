import {useProduct} from '@shopify/hydrogen/client';
import {useEffect} from 'react';

export default function ProductOptions() {
  const {options, setSelectedOption, selectedOptions, selectedVariant} =
    useProduct();

  // Append query on variant change
  useEffect(() => {
    // Storefront product variant IDs can either be an encoded base64 string or GID.
    // Storefront `2022-04` and beyond will only return GIDs
    // Reference: https://shopify.dev/api/examples/object-ids
    let gid;
    if (selectedVariant?.id.startsWith('gid://')) {
      gid = selectedVariant.id;
    } else {
      // If variant ID is not a GID, try decode
      try {
        gid = window.atob(selectedVariant?.id);
      } catch (err) {
        //
      }
    }

    // Extract 'raw' variant ID (number) and modify history
    const variantIdRaw = gid?.match(/[^/]+$/i)[0];
    if (variantIdRaw) {
      window.history.replaceState({}, '', `?variant=${variantIdRaw}`);
    }
  }, [selectedVariant?.id]);

  // Display nothing if we only have one product option with less than one value
  // (typically a product with only a default variant)
  if (options.length === 1 && options?.[0]?.values.length <= 1) {
    return null;
  }

  return (
    <>
      {options.map(({name, values}) => {
        return (
          <fieldset key={name} className="my-3">
            <legend className="font-medium text-sm text-gray-700">
              {name}
            </legend>

            <div className="flex items-start flex-wrap gap-1 mt-1">
              {values.map((value) => {
                const checked = selectedOptions[name] === value;
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
                      onChange={() => setSelectedOption(name, value)}
                    />
                    <div
                      className={`px-3 py-2 border cursor-pointer text-sm ${
                        checked ? 'bg-gray-900 text-white' : 'text-gray-900'
                      }`}
                    >
                      {value}
                    </div>
                  </label>
                );
              })}
            </div>
          </fieldset>
        );
      })}
    </>
  );
}
