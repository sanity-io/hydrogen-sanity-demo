import {
  Link,
  useLocation,
  useSearchParams,
  useTransition,
} from '@remix-run/react';
import {
  ProductOption,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';

export default function ProductOptions({
  options,
  selectedVariant,
}: {
  options: ProductOption[];
  selectedVariant: ProductVariant;
}) {
  const {pathname, search} = useLocation();
  const [currentSearchParams] = useSearchParams();
  const transition = useTransition();

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

  // Update the in-flight request data from the 'transition' (if available)
  // to create an optimistic UI that selects a link before the request is completed
  const searchParams = transition.location
    ? new URLSearchParams(transition.location.search)
    : paramsWithDefaults;

  return (
    <div className="mb-6 grid gap-4">
      {/* Each option will show a label and option value <Links> */}
      {options.map((option) => {
        if (!option.values.length) {
          return;
        }
        // get the currently selected option value
        const currentOptionVal = searchParams.get(option.name);

        return (
          <div
            key={option.name}
            className="mb-4 flex flex-col flex-wrap gap-y-2 last:mb-0"
          >
            <h3 className="text-lead min-w-[4rem] max-w-prose whitespace-pre-wrap font-bold">
              {option.name}
            </h3>

            <div className="flex flex-wrap items-baseline gap-4">
              {option.values.map((value) => {
                const linkParams = new URLSearchParams(searchParams);
                const isSelected = currentOptionVal === value;
                linkParams.set(option.name, value);
                return (
                  <Link
                    key={value}
                    to={`${pathname}?${linkParams.toString()}`}
                    preventScrollReset
                    replace
                    className={`cursor-pointer border-b-[1.5px] py-1 leading-none transition-all duration-200 ${
                      isSelected ? 'border-gray-500' : 'border-neutral-50'
                    }`}
                  >
                    {value}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
