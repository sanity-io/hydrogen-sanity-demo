import {useMemo} from 'react';
import sanityConfig from '../../../sanity.config';
import type {SanityAssetImage, SanityProductWithVariant} from '../../types';
import ProductHero from '../product/ProductHero.server';
import SanityImage from '../SanityImage.client';

type Props = {
  content?: SanityAssetImage | SanityProductWithVariant;
};

export default function HeroContent({content}: Props) {
  const heroContent = useMemo(() => {
    switch (content?._type) {
      case 'image': {
        return (
          <SanityImage
            alt={content?.altText}
            crop={content?.crop}
            dataset={sanityConfig.dataset}
            hotspot={content?.hotspot}
            layout="fill"
            objectFit="cover"
            projectId={sanityConfig.projectId}
            sizes="100vw"
            src={content?.asset._ref}
          />
        );
      }
      case 'productWithVariant': {
        if (!content?.gid || !content.variantGid) {
          return null;
        }

        return (
          <ProductHero gid={content?.gid} variantGid={content.variantGid} />
        );
      }
    }
  }, []);

  return (
    <div className="relative flex aspect-[1300/768] w-full place-content-center overflow-hidden rounded-md bg-lightGray">
      {heroContent}
    </div>
  );
}
