import {useState, Suspense, useMemo} from 'react';
import {Listbox} from '@headlessui/react';
import SpinnerIcon from './SpinnerIcon.client';
import RadioIcon from './RadioIcon.client';
import clsx from 'clsx';
import {ArrowIcon} from './icons/Arrow.client';
import {useServerProps} from '@shopify/hydrogen';

export const SORT_OPTIONS = [
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
] as const;

/**
 * A client component that selects the appropriate country to display for products on a website
 */

type Props = {
  initialSortOrder: string;
};

// TODO: convert kebab-case to SNAKE_CASE - remove this when sort order is consistently stored with Sanity Connect direct sync
function __tempToSnakeCase(str?: string) {
  return str?.replace(/-/g, '_').toUpperCase();
}

export default function SortSelector({initialSortOrder}: Props) {
  const [listboxOpen, setListboxOpen] = useState(false);
  const [selectedSortOrder, setSelectedSortOrder] = useState(
    __tempToSnakeCase(initialSortOrder),
  );
  const {setServerProps} = useServerProps();

  // Remove 'Default' sort option if current collection is not manual / automated
  const sortOptions = useMemo(() => {
    return selectedSortOrder === 'MANUAL'
      ? SORT_OPTIONS
      : SORT_OPTIONS.filter(
          (option) => option.collectionSortOrder !== 'MANUAL',
        );
  }, [selectedSortOrder]);

  const handleChange = (sortOption: typeof SORT_OPTIONS[number]) => {
    setSelectedSortOrder(
      sortOption?.collectionSortOrder
        ? __tempToSnakeCase(sortOption.collectionSortOrder)
        : undefined,
    );
    setServerProps('productSort', sortOption.productSort);
  };

  return (
    <Listbox onChange={handleChange}>
      {({open}) => {
        const currentSortOption = sortOptions.find(
          (option) => option.collectionSortOrder === selectedSortOrder,
        );
        setTimeout(() => setListboxOpen(open));
        return (
          <div className="relative inline-flex">
            <Listbox.Button className="select">
              <span className="mr-2">Sort by: {currentSortOption?.name}</span>
              <ArrowIcon className={open ? 'rotate-180' : 'rotate-0'} />
            </Listbox.Button>

            <Listbox.Options className="absolute top-full right-0 z-10 min-w-[150px] overflow-hidden rounded shadow">
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
                      selectedSortOrder={selectedSortOrder}
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
  selectedSortOrder,
  getClassName,
  options,
}: {
  selectedSortOrder?: any;
  getClassName: (active: boolean) => string;
  options: typeof SORT_OPTIONS;
}) {
  return options.map((sortOption) => {
    const isSelected = sortOption.collectionSortOrder === selectedSortOrder;
    return (
      <Listbox.Option key={sortOption.name} value={sortOption}>
        {({active}) => (
          <div className={getClassName(active)}>
            <span className="mr-8">{sortOption.name}</span>
            <RadioIcon checked={isSelected} />
          </div>
        )}
      </Listbox.Option>
    );
  });
}
