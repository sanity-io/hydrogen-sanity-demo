import {useServerState} from '@shopify/hydrogen/client';
import clsx from 'clsx';
import useEmblaCarousel from 'embla-carousel-react';
import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';

import sanityConfig from '../../sanity.config';
import LinkProduct from './LinkProduct.client';
import SanityImage from './SanityImage.client';

const GalleryCarousel = (props) => {
  const {gallery} = props;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewportRef, emblaApi] = useEmblaCarousel({loop: true});
  const history = useHistory();
  const {setServerState} = useServerState();

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

  const handleSlideClick = (index) => {
    if (!emblaApi) {
      return;
    }

    if (emblaApi.clickAllowed()) {
      const product = gallery[index]?.productWithVariant?.product;
      const productUrl = `/products/${product?.store?.slug?.current}?variant=${product?.variantId}`;

      // TODO: refactor this out
      setServerState('variantId', product?.variantId);
      history.push(productUrl);
    }
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
    <div className="embla">
      <div className="embla__viewport relative" ref={viewportRef}>
        <div className="embla__container">
          {gallery.map((link, index) => {
            const image = link.image;

            if (!image) {
              return null;
            }

            return (
              <div
                className="embla__slide"
                key={link?._key}
                onClick={() => handleSlideClick(index)}
              >
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
            );
          })}
        </div>

        {/* Slide title */}
        <div className="absolute flex gap-1 h-full items-center justify-center left-0 pointer-events-none top-0 w-full z-1">
          {gallery.map((link, index) => {
            if (!link?.title) {
              return null;
            }
            return (
              <div
                className={clsx([
                  'font-medium px-1 py-4 md:text-4xl text-2xl text-white',
                  selectedIndex === index ? 'block' : 'hidden',
                ])}
                key={link?._key}
              >
                {link.title}
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation dots */}
      <div className="flex gap-1 justify-center w-full">
        {gallery.map((link, index) => {
          return (
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
