import sanityConfig from '../../sanity.config';
import SanityImage from './SanityImage.client';

export default function ProductGallery(props) {
  const {images} = props;

  if (!images?.length) {
    return null;
  }

  return (
    <ul className="grid lg:grid-cols-2 gap-5">
      {images.map((image) => {
        return (
          <li key={image?._key}>
            <div className="aspect-w-4 aspect-h-3 bg-gray-100 relative">
              <SanityImage
                alt={image?.altText}
                crop={image?.crop}
                dataset={sanityConfig.dataset}
                hotspot={image?.hotspot}
                layout="fill"
                objectFit="cover"
                projectId={sanityConfig.projectId}
                sizes={['100vw', null, '25vw']}
                src={image?.asset._ref}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
