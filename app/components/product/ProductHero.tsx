import {useMatches} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import type {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';

import ProductTile from '~/components/product/Tile';

type Props = {
  gid: string;
  variantGid: string;
};

export default function ProductHero({gid, variantGid}: Props) {
  const storefrontData =
    useMatches().find((match) => match.data?.storefrontData)?.data
      ?.storefrontData || {};

  const storefrontProduct = storefrontData.products.find(
    (product: Product) => product.id === gid,
  );

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
