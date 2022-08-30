import {gql, Image, Link, useShopQuery} from '@shopify/hydrogen';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';
import clsx from 'clsx';
import type {SanityModuleCollection} from '../../types';
import Button from '../elements/Button';

type Props = {
  module?: SanityModuleCollection;
};

type ShopifyPayload = {
  collection: Partial<Collection>;
};

export default function CollectionModule({module}: Props) {
  const collection = module?.collection;
  if (!collection?.gid || !collection?.slug) {
    return null;
  }

  // Conditionally fetch Shopify document
  let storefrontCollection: Partial<Collection> | undefined;
  if (collection.gid) {
    const {data} = useShopQuery<ShopifyPayload>({
      query: QUERY_SHOPIFY,
      variables: {
        id: collection.gid,
      },
    });
    storefrontCollection = data.collection;
  }

  return (
    <Link
      className="group relative flex aspect-[4/3] h-full w-full flex-col items-center justify-center md:aspect-square"
      to={collection.slug}
    >
      <div className="relative flex h-full w-full flex-col items-center justify-center">
        {/* Vector artwork */}
        {collection.vector && (
          <div
            className={clsx(
              'absolute top-2 left-2 bottom-2 right-1 duration-1000 ease-out',
              'group-hover:scale-[1.01]',
            )}
            style={{
              WebkitMask: `url(${collection.vector}) center center / contain no-repeat`,
              mask: `url(${collection.vector}) center center / contain no-repeat`,
            }}
          >
            {module?.showBackground && storefrontCollection?.image ? (
              <>
                <Image
                  className="absolute h-full w-full bg-cover bg-center object-cover object-center"
                  data={storefrontCollection.image}
                />
                {/* Overlay */}
                <div
                  className={clsx(
                    'absolute top-0 left-0 h-full w-full bg-black bg-opacity-20 duration-500 ease-out',
                    'group-hover:bg-opacity-30',
                  )}
                />
              </>
            ) : (
              <div
                className="h-full w-full"
                style={{background: collection?.colorTheme?.text || 'darkGray'}}
              />
            )}
          </div>
        )}
        {/* Title */}
        <div
          className={clsx(
            'relative mt-[0.5em] w-[65%] text-center text-2xl',
            'group-hover:underline',
            'md:text-3xl',
            collection.vector ? 'text-white' : 'text-offBlack',
          )}
        >
          {collection.title}
        </div>
        <Button className="pointer-events-none relative mt-6 bg-white text-offBlack hover:opacity-50">
          Shop collection
        </Button>
      </div>
    </Link>
  );
}

const QUERY_SHOPIFY = gql`
  query collection($id: ID!) {
    collection: collection(id: $id) {
      image {
        altText
        height
        id
        url
        width
      }
    }
  }
`;
