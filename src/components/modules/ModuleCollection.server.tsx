import {Link} from '@shopify/hydrogen';
import clsx from 'clsx';
import {DEFAULT_BUTTON_STYLES} from '../../constants';
import {SanityModuleCollection} from '../../types';

type Props = {
  module: SanityModuleCollection;
};
export default function ModuleCollection({module}: Props) {
  const collection = module.collection;
  if (!collection) {
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
            className="absolute top-2 left-2 bottom-2 right-1 duration-1000 ease-out group-hover:scale-[1.01]"
            style={{
              background: collection?.colorTheme?.text || 'darkGray',
              WebkitMask: `url(${collection.vector}) center center / contain no-repeat`,
              mask: `url(${collection.vector}) center center / contain no-repeat`,
            }}
          />
        )}

        {/* Title */}
        <div
          className={clsx(
            'relative mt-[0.5em] w-[65%] text-center text-2xl font-bold group-hover:underline',
            'md:text-3xl',
            collection.vector ? 'text-white' : 'text-offBlack',
          )}
        >
          {collection.title}
        </div>

        <div
          className={clsx(
            DEFAULT_BUTTON_STYLES,
            'pointer-events-none relative mt-6 bg-white text-offBlack group-hover:bg-lightGray',
          )}
        >
          Shop collection
        </div>
      </div>
    </Link>
  );
}
