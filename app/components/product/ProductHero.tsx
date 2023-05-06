import {Image} from '@shopify/hydrogen';
import type {ProductVariant} from '@shopify/hydrogen/storefront-api-types';

import ProductTile from '~/components/product/Tile';
import {useGid} from '~/lib/utils';

type Props = {
  gid: string;
  variantGid: string;
};

export default function ProductHero({gid, variantGid}: Props) {
  const storefrontProduct = useGid(gid);

  if (!storefrontProduct) {
    return null;
  }

  const firstVariant =
    storefrontProduct.variants.nodes.find(
      (variant: ProductVariant) => variant.id == variantGid,
    ) ?? storefrontProduct.variants.nodes[0];

  return (
    <>
      {firstVariant.image && (
        <Image
          className="absolute h-full w-full transform bg-cover bg-center object-cover object-center"
          data={firstVariant.image}
        />
      )}

      <div className="absolute bottom-4 right-4">
        <ProductTile storefrontProduct={storefrontProduct} />
      </div>
    </>
  );
}
