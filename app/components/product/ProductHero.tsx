import {Image} from '@shopify/hydrogen';

import type {ProductWithNodes} from '~/types/shopify';

import ProductTile from './Tile';

export default function ProductHero({data}: {data: ProductWithNodes}) {
  const firstVariant = data.variants.nodes[0];

  return (
    <>
      {firstVariant.image && (
        <Image
          className="absolute h-full w-full transform bg-cover bg-center object-cover object-center"
          data={firstVariant.image}
        />
      )}

      <div className="absolute bottom-4 right-4">
        <ProductTile storefrontProduct={data} />
      </div>
    </>
  );
}
