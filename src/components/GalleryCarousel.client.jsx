import clsx from 'clsx';
import useEmblaCarousel from 'embla-carousel-react';
import React, {useCallback, useEffect, useState} from 'react';
import sanityConfig from '../../sanity.config';
import LinkProduct from './LinkProduct.client';
import SanityImage from './SanityImage.client';

const GalleryCarousel = (props) => {
  const {gallery} = props;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewportRef, emblaApi] = useEmblaCarousel({loop: true});

  const handleSelect = (index) => {
    if (!emblaApi) {
      return;
    }
    emblaApi.scrollTo(index);
  };

  const handleSelected = useCallback(() => {
    if (!emblaApi) {
      return;
    }
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', handleSelected);
    }

    return () => {
      if (emblaApi) {
        emblaApi.off('select', handleSelected);
      }
    };
  }, [emblaApi, handleSelected]);

  return (
    <div className="embla">
      <div className="embla-viewport relative" ref={viewportRef}>
        <div className="embla-container">
          {gallery.map((link) => {
            const image = link.image;

            if (!image) {
              return null;
            }

            return (
              <div className="embla-slide" key={link?._key}>
                <div className="embla-slide-inner">
                  <div className="aspect-w-16 aspect-h-9 relative w-full">
                    <SanityImage
                      alt={image?.altText}
                      crop={image?.crop}
                      dataset={sanityConfig.dataset}
                      hotspot={image?.hotspot}
                      layout="fill"
                      objectFit="cover"
                      projectId={sanityConfig.projectId}
                      sizes={['100vw']}
                      src={image?.asset._ref}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Slide title */}
        <div className="absolute flex gap-1 h-full items-center justify-center left-0 top-0 w-full z-1">
          {gallery.map((link, index) => {
            if (!link?.title) {
              return null;
            }
            const product = gallery[index]?.productWithVariant?.product;
            return (
              <div
                className={clsx([
                  'font-medium px-1 py-4 md:text-4xl text-2xl text-white',
                  selectedIndex === index ? 'block' : 'hidden',
                ])}
                key={link?._key}
              >
                <LinkProduct
                  handle={product?.store?.slug?.current}
                  variantId={product?.variantId}
                >
                  {link.title}
                </LinkProduct>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation dots */}
      <div className="flex gap-1 justify-center w-full">
        {gallery.map((link, index) => {
          return (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
            <div
              className={clsx([
                'px-1 py-4',
                selectedIndex === index
                  ? 'opacity-60'
                  : 'cursor-pointer opacity-20',
              ])}
              key={link?._key}
              onClick={() => handleSelect(index)}
            >
              <div className="bg-black h-2 rounded-full w-2" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GalleryCarousel;
