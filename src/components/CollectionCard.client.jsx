import {Link} from '@shopify/hydrogen/client';

import sanityImageUrl from '../utils/sanityImageUrl';

const CollectionCard = (props) => {
  const {collection} = props;

  const collectionUrl = `/collections/${collection?.slug}`;

  // TODO: create generic SanityImage wrapper

  return (
    <div className="col-span-2">
      <Link to={collectionUrl}>
        <div className="aspect-w-4 aspect-h-3">
          <div className="bg-black flex flex items-center justify-center">
            {/* Image */}
            <img
              alt=""
              className="absolute bg-white h-full object-cover opacity-90 w-full"
              src={sanityImageUrl(collection.image, {width: 800})}
            />
            {/* Title */}
            <div className="font-medium relative md:text-4xl text-2xl text-white">
              {collection?.title}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CollectionCard;
