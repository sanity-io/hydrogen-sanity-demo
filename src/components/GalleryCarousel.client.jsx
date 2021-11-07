import useEmblaCarousel from 'embla-carousel-react';
import React from 'react';

import sanityConfig from '../../sanity.config';
import SanityImage from './SanityImage.client';

const GalleryCarousel = (props) => {
  const {images} = props;

  const [viewportRef, embla] = useEmblaCarousel({loop: true});

  return (
    <div>
      <div className="embla">
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
      </div>
    </div>
  );
};

export default GalleryCarousel;
