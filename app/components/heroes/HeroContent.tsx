import {useMemo} from 'react';

import ImageWithProductHotspots from '~/components/media/ImageWithProductHotspots';
import type {
  SanityImageWithProductHotspots,
  SanityProductWithVariant,
} from '~/types/sanity';
import type {ProductWithNodes} from '~/types/shopify';

import ProductHero from '../product/ProductHero';

type Props = {
  content?: SanityImageWithProductHotspots | SanityProductWithVariant;
  data: ProductWithNodes[] | ProductWithNodes;
};

export default function HeroContent({content, data}: Props) {
  const heroContent = useMemo(() => {
    switch (content?._type) {
      case 'imageWithProductHotspots': {
        return (
          <div className="relative w-full">
            <ImageWithProductHotspots
              content={content}
              data={data as ProductWithNodes[]}
            />
          </div>
        );
      }

      case 'productWithVariant': {
        if (!content?.gid || !content.variantGid) {
          return null;
        }

        return (
          <div className="aspect-[1300/768] w-full">
            <ProductHero data={data as ProductWithNodes} />
          </div>
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
