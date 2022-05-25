import {Image, MediaFile, useProduct} from '@shopify/hydrogen';

/**
 * A client component that defines a media gallery for hosting images, 3D models, and videos of products
 */
export default function Gallery() {
  const {media, selectedVariant} = useProduct();

  const featuredMedia = selectedVariant?.image || media[0]?.image;
  const featuredMediaSrc = featuredMedia?.url.split('?')[0];
  const galleryMedia = media.filter((med: any) => {
    if (
      med.mediaContentType === MODEL_3D_TYPE ||
      med.mediaContentType === VIDEO_TYPE ||
      med.mediaContentType === EXTERNAL_VIDEO_TYPE
    ) {
      return true;
    }

    return !med.image.url.includes(featuredMediaSrc);
  });

  if (!media.length) {
    return null;
  }

  return (
    <div
      className="no-scrollbar scroll-snap-x flex h-[485px] w-1/2 place-content-start gap-2 overflow-x-scroll scroll-smooth md:grid md:h-auto md:grid-cols-2"
      tabIndex={-1}
    >
      {selectedVariant?.image && (
        <Image
          fetchpriority="high"
          data={selectedVariant.image}
          className="md:flex-shrink-none h-full w-[80vw] flex-shrink-0 snap-start border border-black object-cover object-center md:col-span-2 md:h-auto md:w-full"
        />
      )}
      {galleryMedia.map((med: any) => {
        let extraProps = {};

        if (med.mediaContentType === MODEL_3D_TYPE) {
          extraProps = MODEL_3D_PROPS;
        }

        return (
          <MediaFile
            // @ts-expect-error <MediaFile> should accept tabIndex
            tabIndex={0}
            key={med.id || med.image.id}
            className="h-full w-[80vw] flex-shrink-0 snap-start border border-black object-cover object-center transition-all md:h-auto md:w-auto"
            data={med}
            fetchpriority="low"
            loaderOptions={{
              height: '485',
              crop: 'center',
            }}
            {...extraProps}
          />
        );
      })}
    </div>
  );
}

const MODEL_3D_TYPE = 'MODEL_3D';
const MODEL_3D_PROPS = {
  interactionPromptThreshold: '0',
};
const VIDEO_TYPE = 'VIDEO';
const EXTERNAL_VIDEO_TYPE = 'EXTERNAL_VIDEO';
