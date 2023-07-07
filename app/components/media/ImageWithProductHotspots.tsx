import {useMatches} from '@remix-run/react';

import SanityImage from '~/components/media/SanityImage';
import ProductHotspot from '~/components/product/Hotspot';
import type {SanityImageWithProductHotspots} from '~/lib/sanity';

type Props = {
  content: SanityImageWithProductHotspots;
};

export default function ImageWithProductHotspots({content}: Props) {
  const [root] = useMatches();
  const {sanityDataset, sanityProjectID} = root.data;

  return (
    <>
      {content.productHotspots?.map((hotspot) => {
        if (!hotspot?.product?.gid) {
          return null;
        }

        return (
          <ProductHotspot
            key={hotspot._key}
            productGid={hotspot?.product?.gid}
            variantGid={hotspot?.product?.variantGid}
            x={hotspot.x}
            y={hotspot.y}
          />
        );
      })}

      <SanityImage
        alt={content?.image?.altText}
        crop={content?.image?.crop}
        dataset={sanityDataset}
        hotspot={content?.image?.hotspot}
        layout="responsive"
        objectFit="cover"
        projectId={sanityProjectID}
        sizes="100vw"
        src={content?.image?.asset?._ref}
      />
    </>
  );
}
