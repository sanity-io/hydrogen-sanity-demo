import {useMemo} from 'react';

import ImageWithProductHotspots from '~/components/media/ImageWithProductHotspots';
import type {
  SanityImageWithProductHotspots,
  SanityProductWithVariant,
} from '~/types/sanity';
import type {ProductWithNodes} from '~/types/shopify';
// import ProductHero from '../product/ProductHero.server';

type Props = {
  content?: SanityImageWithProductHotspots | SanityProductWithVariant;
};

export default function HeroContent({content}: Props) {
  const heroContent = useMemo(() => {
    switch (content?._type) {
      case 'imageWithProductHotspots': {
        return (
          <div className="relative w-full">
            <ImageWithProductHotspots content={content} />
          </div>
        );
      }

      case 'productWithVariant': {
        if (!content?.gid || !content.variantGid) {
          return null;
        }

        return (
          <p>productWithVariant coming soon</p>
          // <div className="aspect-[1300/768] w-full">
          //   <ProductHero gid={content?.gid} variantGid={content.variantGid} />
          // </div>
        );
      }
    }
  }, []);

  return (
    <div className="relative flex w-full place-content-center overflow-hidden rounded-md bg-lightGray">
      {heroContent}
    </div>
  );
}
