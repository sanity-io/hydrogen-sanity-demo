import clsx from 'clsx';
import useEmblaCarousel from 'embla-carousel-react';
import React, {useEffect, useState} from 'react';

import sanityConfig from '../../sanity.config';
import SanityImage from './SanityImage.client';

const GalleryCarousel = (props) => {
  const {images} = props;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewportRef, emblaApi] = useEmblaCarousel({loop: true});

  const handleSelect = (index) => {
    if (!emblaApi) {
      return;
    }
    emblaApi.scrollTo(index);
  };

  const handleSelected = () => {
    if (!emblaApi) {
      return;
    }
    setSelectedIndex(emblaApi.selectedScrollSnap());
  };

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', handleSelected);
    }

    return () => {
      if (emblaApi) {
        emblaApi.off('select', handleSelected);
      }
    };
  }, [emblaApi]);

  return (
    <div className="embla relative">
      <div className="embla__viewport" ref={viewportRef}>
        <div className="embla__container">
          {images.map((image) => (
            <div className="embla__slide" key={image?._key}>
              <div className="embla__slide__inner">
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
          ))}
        </div>
      </div>

      {/* Navigation dots */}
      <div className="flex gap-1 justify-center w-full">
        {images.map((image, index) => (
          <div
            className={clsx([
              'px-1 py-4',
              selectedIndex === index
                ? 'opacity-60'
                : 'cursor-pointer opacity-20',
            ])}
            key={image?._key}
            onClick={() => handleSelect(index)}
          >
            <div className="bg-black h-2 rounded-full w-2" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryCarousel;
