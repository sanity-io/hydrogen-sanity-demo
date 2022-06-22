import {useState, Suspense, useMemo} from 'react';
// @ts-expect-error incompatibility with node16 resolution
import {Listbox} from '@headlessui/react';
import SpinnerIcon from '../icons/Spinner';
import RadioIcon from '../icons/Radio';
import clsx from 'clsx';
import {ChevronDownIcon} from '../icons/ChevronDown';
import {useServerProps} from '@shopify/hydrogen';

type SortOption = {
  collectionSortOrder: string;
  name: string;
  productSort: {
    key?: string;
    reverse?: boolean;
  };
};

export const SORT_OPTIONS: SortOption[] = [
  {
    name: 'Default',
    collectionSortOrder: 'MANUAL',
    productSort: {
      key: undefined,
      reverse: false,
    },
  },
  {
    name: 'Price (low to high)',
    collectionSortOrder: 'PRICE_ASC',
    productSort: {
      key: 'PRICE',
      reverse: false,
    },
  },
  {
    name: 'Price (high to low)',
    collectionSortOrder: 'PRICE_DESC',
    productSort: {
      key: 'PRICE',
      reverse: true,
    },
  },
  {
    name: 'Title (A to Z)',
    collectionSortOrder: 'ALPHA_ASC',
    productSort: {
      key: 'TITLE',
      reverse: false,
    },
  },
  {
    name: 'Title (Z to A)',
    collectionSortOrder: 'ALPHA_DESC',
    productSort: {
      key: 'TITLE',
      reverse: true,
    },
  },
  {
    name: 'Best selling',
    collectionSortOrder: 'BEST_SELLING',
    productSort: {
      key: 'BEST_SELLING',
      reverse: undefined,
    },
  },
  {
    name: 'New arrivals',
    collectionSortOrder: 'CREATED',
    productSort: {
      key: 'CREATED',
      reverse: false,
    },
  },
];

/**
 * A client component that selects the appropriate country to display for products on a website
 */

type Props = {
  initialSortOrder: string;
};

export default function SortOrderSelect({initialSortOrder}: Props) {
  // Remove 'Default' sort option if current collection is not manual / automated
  const sortOptions = useMemo(() => {
    return initialSortOrder === 'MANUAL'
      ? SORT_OPTIONS
      : SORT_OPTIONS.filter(
          (option) => option.collectionSortOrder !== 'MANUAL',
        );
  }, [initialSortOrder]);

  const [listboxOpen, setListboxOpen] = useState(false);
  const {setServerProps} = useServerProps();

  const [selectedSortOption, setSelectedSortOption] = useState(
    sortOptions.find(
      (option) => option.collectionSortOrder === initialSortOrder,
    ),
  );

  const handleChange = (sortOption: SortOption) => {
    setSelectedSortOption(sortOption);
    setServerProps('productSort', sortOption.productSort);
  };

  return (
    <Listbox onChange={handleChange} value={selectedSortOption}>
      {({open}: {open: boolean}) => {
        setTimeout(() => setListboxOpen(open));
        return (
          <div className="relative inline-flex">
            <Listbox.Button className="select">
              <span className="mr-2">Sort by: {selectedSortOption?.name}</span>
              <ChevronDownIcon className={open ? 'rotate-180' : 'rotate-0'} />
            </Listbox.Button>

            <Listbox.Options
              className={clsx(
                'absolute top-full left-0 right-auto z-10 mt-3 min-w-[150px] overflow-hidden rounded shadow',
                'md:left-auto md:right-0',
              )}
            >
              <div className="overflow-y-auto bg-white">
                {listboxOpen && (
                  <Suspense
                    fallback={
                      <div className="flex justify-center overflow-hidden">
                        <SpinnerIcon />
                      </div>
                    }
                  >
                    <SortOptions
                      selectedSortOption={selectedSortOption}
                      getClassName={(active) => {
                        return clsx([
                          'p-3 flex justify-between items-center text-left font-bold text-sm cursor-pointer whitespace-nowrap',
                          active ? 'bg-lightGray' : null,
                        ]);
                      }}
                      options={sortOptions}
                    />
                  </Suspense>
                )}
              </div>
            </Listbox.Options>
          </div>
        );
      }}
    </Listbox>
  );
}

export function SortOptions({
  selectedSortOption,
  getClassName,
  options,
}: {
  selectedSortOption?: SortOption;
  getClassName: (active: boolean) => string;
  options: SortOption[];
}) {
  return (
    <>
      {options.map((sortOption) => {
        const isSelected = sortOption === selectedSortOption;
        return (
          <Listbox.Option key={sortOption.name} value={sortOption}>
            {({active}: {active: boolean}) => (
              <div className={getClassName(active)}>
                <span className="mr-8">{sortOption.name}</span>
                <RadioIcon checked={isSelected} hovered={active} />
              </div>
            )}
          </Listbox.Option>
        );
      })}
    </>
  );
}
