import {useMatches} from '@remix-run/react';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

import SanityImage from '~/components/media/SanityImage';
import ProductHotspot from '~/components/product/Hotspot';
import type {SanityImageWithProductHotspots} from '~/lib/sanity';
import {useGids} from '~/lib/utils';

type Props = {
  content: SanityImageWithProductHotspots;
};

export default function ImageWithProductHotspots({content}: Props) {
  const [root] = useMatches();
  const {sanityDataset, sanityProjectID} = root.data;
  const gids = useGids();

  return (
    <>
      {content.productHotspots?.map((hotspot) => {
        const storefrontProduct = gids.get(hotspot?.product?.gid) as Product;

        return (
          <ProductHotspot
            key={hotspot._key}
            storefrontProduct={storefrontProduct}
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
