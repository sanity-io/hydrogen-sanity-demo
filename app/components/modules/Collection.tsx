import {Image} from '@shopify/hydrogen';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';
import clsx from 'clsx';

import Button from '~/components/elements/Button';
import {Link} from '~/components/Link';
import type {SanityModuleCollection} from '~/lib/sanity';
import {useGid} from '~/lib/utils';

type Props = {
  module?: SanityModuleCollection;
};

export default function CollectionModule({module}: Props) {
  const collection = module?.collection;
  const collectionGid = collection?.gid;
  const storefrontCollection = useGid<Collection>(collectionGid);

  if (!collection || !collection?.slug || !storefrontCollection) {
    return null;
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
              'absolute bottom-2 left-2 right-1 top-2 duration-1000 ease-out',
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
                    'absolute left-0 top-0 h-full w-full bg-black bg-opacity-20 duration-500 ease-out',
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
