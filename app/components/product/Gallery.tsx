import {MediaFile} from '@shopify/hydrogen';
import {
  MediaImage,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';
import useEmblaCarousel from 'embla-carousel-react';
import {useEffect} from 'react';

import CircleButton from '~/components/elements/CircleButton';
import {ArrowRightIcon} from '~/components/icons/ArrowRight';
import type {ProductWithNodes} from '~/types/shopify';

/**
 * A client component that defines a media gallery for hosting images, 3D models, and videos of products
 */

type Props = {
  storefrontProduct: ProductWithNodes;
  selectedVariant?: ProductVariant;
};

export default function ProductGallery({
  storefrontProduct,
  selectedVariant,
}: Props) {
  const typeNameMap = {
    MODEL_3D: 'Model3d',
    VIDEO: 'Video',
    IMAGE: 'MediaImage',
    EXTERNAL_VIDEO: 'ExternalVideo',
  };

  const media = storefrontProduct?.media?.nodes;
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
        if (mediaItem.mediaContentType === 'IMAGE') {
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
            let extraProps: Record<string, any> = {};

            if (med.mediaContentType === 'MODEL_3D') {
              extraProps = {
                interactionPromptThreshold: '0',
                ar: true,
                loading: 'eager',
                disableZoom: true,
                style: {height: '100%', margin: '0 auto'},
              };
            }

            const data = {
              ...med,
              __typename:
                typeNameMap[med.mediaContentType] || typeNameMap['IMAGE'],
              image: {
                // @ts-ignore
                ...med.image,
                altText: med.alt || 'Product image',
              },
            } as MediaImage;

            return (
              <MediaFile
                className="relative flex w-full shrink-0 grow-0 select-none object-cover"
                data={data}
                draggable={false}
                key={med.id}
                tabIndex={0}
                mediaOptions={{
                  image: {crop: 'center', sizes: '100vw', loading: 'eager'},
                }}
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
