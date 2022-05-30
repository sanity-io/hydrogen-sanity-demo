import {MediaFile, useProduct} from '@shopify/hydrogen';
import useEmblaCarousel from 'embla-carousel-react';
import {useEffect} from 'react';
import ButtonCircle from './buttons/ButtonCircle';
import {IconArrowRight} from './icons/IconArrowRight';

/**
 * A client component that defines a media gallery for hosting images, 3D models, and videos of products
 */

export default function Gallery() {
  const {media, selectedVariant} = useProduct();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    draggable: true,
    loop: false,
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
                // @ts-expect-error <MediaFile> should accept tabIndex
                tabIndex={0}
                key={med.id || med.image.id}
                className="relative flex w-full shrink-0 grow-0 object-cover"
                data={med}
                fetchpriority="high"
                loaderOptions={{
                  height: '485',
                  crop: 'center',
                }}
                {...extraProps}
              />
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-8 left-8 flex gap-3">
        <ButtonCircle onClick={handlePrevious}>
          <IconArrowRight className="rotate-180" />
        </ButtonCircle>
        <ButtonCircle onClick={handleNext}>
          <IconArrowRight />
        </ButtonCircle>
      </div>
    </div>
  );
}

const MODEL_3D_TYPE = 'MODEL_3D';
const MODEL_3D_PROPS = {
  interactionPromptThreshold: '0',
};
const VIDEO_TYPE = 'VIDEO';
const EXTERNAL_VIDEO_TYPE = 'EXTERNAL_VIDEO';
