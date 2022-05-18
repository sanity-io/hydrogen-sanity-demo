import {Image, Link} from '@shopify/hydrogen';
import DebugWrapper from './DebugWrapper';

/**
 * A shared component that defines a single featured collection to display on a storefront
 */
export default function FeaturedCollection({collection}) {
  return collection ? (
    <DebugWrapper name="Featured Collection" shopify>
      <div className="gap-2 grid grid-cols-1 lg:grid-cols-2 items-center overflow-hidden">
        {collection.image ? (
          <Image width="622" height="465" data={collection.image} />
        ) : null}
        <div className="py-10 lg:py-0">
          {/* Title */}
          <h2 className="font-medium mb-5">{collection.title}</h2>

          {/* Description */}
          <p className="mb-6">{collection.description}</p>

          <Link
            to={`/collections/${collection.handle}`}
            className="inline-block bg-gray-900 text-white py-4 px-16"
          >
            Shop Collection
          </Link>
        </div>
      </div>
    </DebugWrapper>
  ) : null;
}
