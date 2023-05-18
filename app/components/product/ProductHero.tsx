import {Image} from '@shopify/hydrogen';
import type {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';

import ProductTile from '~/components/product/Tile';
import {useGid} from '~/lib/utils';

type Props = {
  gid: string;
  variantGid: string;
};

export default function ProductHero({gid, variantGid}: Props) {
  const storefrontProduct = useGid<Product>(gid);
  const firstVariant =
    useGid<ProductVariant>(variantGid) ??
    storefrontProduct?.variants.nodes.find(
      (variant) => variant.id == variantGid,
    ) ??
    storefrontProduct?.variants.nodes[0];

  if (!(storefrontProduct && firstVariant)) {
    return null;
  }

  return (
    <>
      {firstVariant.image && (
        <Image
          className="absolute h-full w-full transform bg-cover bg-center object-cover object-center"
          data={firstVariant.image}
          sizes="100vw"
        />
      )}

      <div className="absolute bottom-4 right-4">
        <ProductTile storefrontProduct={storefrontProduct} />
      </div>
    </>
  );
}
