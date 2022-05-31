import {Link} from '@shopify/hydrogen';
import clsx from 'clsx';
import {SanityCollection} from '../../types';

type Props = {
  collection: SanityCollection;
  onClick?: () => void;
};

export default function CardCollection({collection, onClick}: Props) {
  return (
    <Link className="text-lg font-bold" onClick={onClick} to={collection.slug}>
      <div
        className="group relative flex aspect-[4/3] items-center justify-center rounded transition-all duration-500 ease-out hover:rounded-xl"
        style={{
          background: collection?.colorTheme?.background || 'darkGray',
        }}
      >
        {/* Vector artwork */}
        {collection.vector && (
          <div
            className="absolute top-2 left-2 bottom-2 right-1 duration-1000 ease-out group-hover:scale-[1.03]"
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
            'relative text-center group-hover:underline',
            collection.vector ? 'text-white' : 'text-offBlack',
          )}
        >
          {collection.title}
        </div>
      </div>
    </Link>
  );
}
