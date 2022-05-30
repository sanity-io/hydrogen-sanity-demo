import {useServerProps} from '@shopify/hydrogen';
import clsx from 'clsx';
import {COLLECTION_PAGE_SIZE} from '../constants';
import SpinnerIcon from './icons/IconSpinner';

/**
 * A client component that provides functionality to initially show a subset of products and a button to load more products
 */
export default function LoadMoreProducts({startingCount}) {
  const {pending, serverProps, setServerProps} = useServerProps();

  return (
    <div className="flex h-30 items-center justify-center">
      {pending ? (
        <SpinnerIcon />
      ) : (
        <button
          className={clsx(['btn', pending ? 'opacity-50' : undefined])}
          disabled={pending}
          onClick={() => {
            setServerProps(
              'collectionProductCount',
              serverProps.collectionProductCount
                ? serverProps.collectionProductCount + COLLECTION_PAGE_SIZE
                : startingCount + COLLECTION_PAGE_SIZE,
            );
          }}
          type="button"
        >
          Load more
        </button>
      )}
    </div>
  );
}
