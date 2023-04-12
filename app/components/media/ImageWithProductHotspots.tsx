import {useMatches} from '@remix-run/react';

import ProductHotspot from '~/components/product/Hotspot';
import type {SanityImageWithProductHotspots} from '~/types/sanity';
import type {ProductWithNodes} from '~/types/shopify';

import SanityImage from './SanityImage';

type Props = {
  content: SanityImageWithProductHotspots;
  data: ProductWithNodes[];
};

export default function ImageWithProductHotspots({content, data}: Props) {
  const [root] = useMatches();
  const {sanityDataset, sanityProjectID} = root.data;

  // Shopify Products
  const storefrontProducts = data;

  return (
    <>
      {content.productHotspots?.map((hotspot, index) => (
        <ProductHotspot
          key={hotspot._key}
          storefrontProduct={storefrontProducts[index]}
          x={hotspot.x}
          y={hotspot.y}
        />
      ))}

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
