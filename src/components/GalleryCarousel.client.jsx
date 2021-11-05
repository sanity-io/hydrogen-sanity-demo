import useEmblaCarousel from 'embla-carousel-react';
import React from 'react';

import sanityImageUrl from '../utils/sanityImageUrl';

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
                  <img
                    alt=""
                    className="w-full"
                    src={sanityImageUrl(image, {width: 1000})}
                  />
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
