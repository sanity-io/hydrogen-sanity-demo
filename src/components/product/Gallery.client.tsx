import {MediaFile, useProductOptions} from '@shopify/hydrogen';
import {
  MediaContentType,
  MediaImage,
} from '@shopify/hydrogen/storefront-api-types';
import useEmblaCarousel from 'embla-carousel-react';
import {useEffect} from 'react';
import type {ProductWithNodes} from '../../types';
import CircleButton from '../elements/CircleButton';
import {ArrowRightIcon} from '../icons/ArrowRight';

/**
 * A client component that defines a media gallery for hosting images, 3D models, and videos of products
 */

type Props = {
  storefrontProduct: ProductWithNodes;
};

const MODEL_3D_PROPS = {
  interactionPromptThreshold: '0',
};

export default function ProductGallery({storefrontProduct}: Props) {
  const media = storefrontProduct?.media?.nodes;
  const {selectedVariant} = useProductOptions();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    draggable: media && media.length > 1,
    loop: true,
    skipSnaps: true,
    speed: 7,
  });

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
    if (!selectedVariant) {
      return;
    }

    const variantImageUrl = selectedVariant?.image?.url?.split('?')[0];
    const galleryIndex =
      media?.findIndex((mediaItem) => {
        if (mediaItem.mediaContentType === MediaContentType.Image) {
          return (
            (mediaItem as MediaImage)?.image?.url.split('?')[0] ===
            variantImageUrl
          );
        }
        return false;
      }) ?? -1;

    if (emblaApi && galleryIndex >= 0) {
      emblaApi.scrollTo(galleryIndex, true); // instantly scroll
    }
  }, [emblaApi, media, selectedVariant]);

  if (!media?.length) {
    return null;
  }

  return (
    <div className="relative h-screen bg-lightGray" tabIndex={-1}>
      <div className="h-full overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {/* Slides */}
          {media.map((med) => {
            let extraProps = {};
            if (med.mediaContentType === MediaContentType.Model_3D) {
              extraProps = MODEL_3D_PROPS;
            }

            return (
              <MediaFile
                // @ts-expect-error options should accept className
                className="relative flex w-full shrink-0 grow-0 select-none object-cover"
                data={med}
                draggable={false}
                fetchpriority="high"
                key={med.id}
                options={{crop: 'center'}}
                tabIndex={0}
                {...extraProps}
              />
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      {media.length > 1 && (
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
