import {MediaFile, useProduct} from '@shopify/hydrogen';
import useEmblaCarousel from 'embla-carousel-react';
import {useEffect} from 'react';
import CircleButton from '../buttons/Circle';
import {ArrowRightIcon} from '../icons/ArrowRight';

/**
 * A client component that defines a media gallery for hosting images, 3D models, and videos of products
 */

export default function ProductGallery() {
  const {media, selectedVariant} = useProduct();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    draggable: media && media.length > 1,
    loop: true,
    skipSnaps: true,
    speed: 7,
  });

  /*
  const featuredMedia = selectedVariant?.image || media[0]?.image;
  const featuredMediaSrc = featuredMedia?.url.split('?')[0];
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
  */
  const galleryMedia = media;

  const handleNext = () => {
    if (emblaApi) {
      emblaApi.scrollNext();
    }
  };

  const handlePrevious = () => {
    if (emblaApi) {
      emblaApi.scrollPrev();
    }
  };

  useEffect(() => {
    const variantImageUrl = selectedVariant?.image?.url.split('?')[0];
    const galleryIndex = galleryMedia.findIndex(
      (media: any) => media?.image?.url.split('?')[0] === variantImageUrl,
    );

    if (emblaApi && galleryIndex >= 0) {
      emblaApi.scrollTo(galleryIndex, true); // instantly scroll
    }
  }, [emblaApi, galleryMedia, selectedVariant]);

  if (!media.length) {
    return null;
  }

  return (
    <div className="relative h-screen bg-lightGray" tabIndex={-1}>
      <div className="h-full overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {/* Slides */}
          {galleryMedia.map((med: any) => {
            let extraProps = {};

            if (med.mediaContentType === MODEL_3D_TYPE) {
              extraProps = MODEL_3D_PROPS;
            }

            return (
              <MediaFile
                // @ts-expect-error <MediaFile> should accept HTMLAttributes
                className="relative flex w-full shrink-0 grow-0 select-none object-cover"
                data={med}
                draggable={false}
                fetchpriority="high"
                key={med.id || med.image.id}
                options={{
                  height: 1800,
                  crop: 'center',
                }}
                tabIndex={0}
                {...extraProps}
              />
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      {galleryMedia.length > 1 && (
        <div className="absolute bottom-8 left-8 flex gap-3">
          <CircleButton onClick={handlePrevious}>
            <ArrowRightIcon className="rotate-180" />
          </CircleButton>
          <CircleButton onClick={handleNext}>
            <ArrowRightIcon />
          </CircleButton>
        </div>
      )}
    </div>
  );
}

const MODEL_3D_TYPE = 'MODEL_3D';
const MODEL_3D_PROPS = {
  interactionPromptThreshold: '0',
};
const VIDEO_TYPE = 'VIDEO';
const EXTERNAL_VIDEO_TYPE = 'EXTERNAL_VIDEO';
