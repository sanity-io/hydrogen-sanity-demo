import {useServerProps} from '@shopify/hydrogen';
import SpinnerIcon from './SpinnerIcon.client';

/**
 * A client component that provides functionality to initially show a subset of products and a button to load more products
 */
export default function LoadMoreProducts({startingCount}) {
  const {pending, serverProps, setServerProps} = useServerProps();

  return (
    <div className="flex h-14 justify-center">
      {pending ? (
        <SpinnerIcon />
      ) : (
        <button
          type="button"
          disabled={pending}
          className={`font-mono border-4 border-black bg-white px-5 py-3 text-center font-bold uppercase text-black drop-shadow-lg hover:border-white hover:bg-black hover:text-white active:drop-shadow-none ${
            pending ? 'opacity-50' : undefined
          }`}
          onClick={() => {
            setServerProps(
              'collectionProductCount',
              serverProps.collectionProductCount
                ? serverProps.collectionProductCount + 24
                : startingCount + 1,
            );
          }}
        >
          Load more
        </button>
      )}
    </div>
  );
}
