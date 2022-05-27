import {Link} from '@shopify/hydrogen';
import {SanityCollection} from '../types';

type Props = {
  collection: SanityCollection;
  onClick?: () => void;
};

export default function CollectionCard({collection, onClick}: Props) {
  return (
    <Link className="text-lg font-bold" onClick={onClick} to={collection.slug}>
      <div
        className="flex aspect-[4/3] items-center justify-center rounded text-center"
        style={{
          background: collection?.colorTheme?.background || 'darkGray',
          color: collection?.colorTheme?.text || 'white',
        }}
      >
        {collection.title}
      </div>
    </Link>
  );
}
