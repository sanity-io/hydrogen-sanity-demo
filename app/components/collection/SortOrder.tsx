import {Menu} from '@headlessui/react';
import {
  Link,
  useLocation,
  useNavigation,
  useSearchParams,
} from '@remix-run/react';
import clsx from 'clsx';
import {useMemo} from 'react';

import {ChevronDownIcon} from '~/components/icons/ChevronDown';
import RadioIcon from '~/components/icons/Radio';
import {SortParam} from '~/routes/($lang).collections.$handle';

type Props = {
  initialSortOrder: string;
};

type SortOption = {
  label: string;
  key: SortParam;
  sortKey?: string;
  reverse?: boolean;
};

export const SORT_OPTIONS: SortOption[] = [
  {
    label: 'Featured',
    key: 'featured',
    sortKey: 'MANUAL',
    reverse: false,
  },
  {
    label: 'Price (low to high)',
    key: 'price-low-high',
    sortKey: 'PRICE',
    reverse: false,
  },
  {
    label: 'Price (high to low)',
    key: 'price-high-low',
    sortKey: 'PRICE',
    reverse: true,
  },
  {
    label: 'Title (A to Z)',
    key: 'title-a-z',
    sortKey: 'TITLE',
    reverse: false,
  },
  {
    label: 'Title (Z to A)',
    key: 'title-z-a',
    sortKey: 'TITLE',
    reverse: true,
  },
  {
    label: 'Best Selling',
    key: 'best-selling',
    sortKey: 'BEST_SELLING',
    reverse: undefined,
  },
  {
    label: 'New Arrivals',
    key: 'newest',
    sortKey: 'CREATED',
    reverse: false,
  },
];

export default function SortOrder({initialSortOrder}: Props) {
  // Remove 'Default' sort option if current collection is not manual / automated
  const sortOptions = useMemo(() => {
    return initialSortOrder === 'MANUAL'
      ? SORT_OPTIONS
      : SORT_OPTIONS.filter((option) => option.sortKey !== 'MANUAL');
  }, [initialSortOrder]);

  const [params] = useSearchParams();
  const location = useLocation();
  const navigation = useNavigation();

  const currentSort = navigation.location
    ? new URLSearchParams(navigation.location.search).get('sort')
    : params.get('sort');

  const activeItem =
    sortOptions.find((item) => item.key === currentSort) ||
    sortOptions.find((item) => item.sortKey === initialSortOrder);

  return (
    <>
      <Menu>
        {({open}: {open: boolean}) => {
          return (
            <div className="relative inline-flex">
              <Menu.Button className="select">
                <span className="mr-2">
                  Sort by{activeItem && `: ${activeItem?.label}`}
                </span>
                <ChevronDownIcon className={open ? 'rotate-180' : 'rotate-0'} />
              </Menu.Button>
              <Menu.Items
                className={clsx(
                  'absolute left-0 right-auto top-full z-10 mt-3 min-w-[150px] overflow-hidden rounded shadow',
                  'md:left-auto md:right-0',
                )}
              >
                <div className="overflow-y-auto bg-white">
                  <>
                    {sortOptions.map((item) => {
                      const isSelected = item.key === activeItem?.key;
                      return (
                        <Menu.Item key={item.label}>
                          {({active}: {active: boolean}) => (
                            <Link
                              to={getSortLink(item.key, params, location)}
                              className={clsx([
                                'flex cursor-pointer items-center justify-between whitespace-nowrap p-3 text-left text-sm font-bold',
                                isSelected ? 'bg-lightGray' : null,
                              ])}
                              preventScrollReset
                            >
                              <span className="mr-8">{item.label}</span>
                              <RadioIcon
                                checked={isSelected}
                                hovered={active}
                              />
                            </Link>
                          )}
                        </Menu.Item>
                      );
                    })}
                  </>
                </div>
              </Menu.Items>
            </div>
          );
        }}
      </Menu>
    </>
  );
}

function getSortLink(
  sort: SortParam,
  params: URLSearchParams,
  location: ReturnType<typeof useLocation>,
) {
  params.set('sort', sort);
  return `${location.pathname}?${params.toString()}`;
}
