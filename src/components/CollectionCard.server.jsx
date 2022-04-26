import {Link} from '@shopify/hydrogen/client';
import {Suspense} from 'react';
import sanityConfig from '../../sanity.config';
import SanityImage from './SanityImage.client';

const CollectionCard = (props) => {
  const {collection} = props;

  const collectionUrl = `/collections/${collection?.slug}`;

  return (
    <div className="col-span-2">
      <Link to={collectionUrl}>
        <div className="aspect-w-4 aspect-h-3 group">
          <div className="bg-gray-200 flex flex items-center justify-center">
            {/* Image */}
            {collection.image && (
              <Suspense fallback={null}>
                <SanityImage
                  alt={collection.image?.altText}
                  crop={collection.image?.crop}
                  dataset={sanityConfig.dataset}
                  hotspot={collection.image?.hotspot}
                  layout="fill"
                  objectFit="cover"
                  projectId={sanityConfig.projectId}
                  sizes={['100vw', null, '50vw']}
                  src={collection.image?.asset._ref}
                />
              </Suspense>
            )}

            {/* Overlay */}
            <div className="absolute bg-black bg-opacity-0 duration-500 group-hover:bg-opacity-10 h-full transition w-full" />

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
