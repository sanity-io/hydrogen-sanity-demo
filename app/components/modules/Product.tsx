import {useMatches} from '@remix-run/react';
import type {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';

import type {SanityModuleProduct} from '~/types/sanity';

import ProductCard from '../product/Card';
import ProductPill from '../product/Pill';

type Props = {
  imageAspectClassName?: string;
  layout?: 'card' | 'pill';
  module?: SanityModuleProduct;
};

export default function ProductModule({
  imageAspectClassName,
  layout = 'card',
  module,
}: Props) {
  const storefrontData =
    useMatches().find((match) => match.data?.storefrontData)?.data
      ?.storefrontData || {};

  const productGid = module?.productWithVariant.gid;
  const productVariantGid = module?.productWithVariant.variantGid;

  const storefrontProduct = storefrontData.products.find(
    (product: Product) => product.id === productGid,
  );

  if (!storefrontProduct) {
    return null;
  }

  if (layout === 'pill') {
    return (
      <ProductPill
        storefrontProduct={storefrontProduct}
        variantGid={productVariantGid}
      />
    );
  }

  if (layout === 'card') {
    return (
      <ProductCard
        imageAspectClassName={imageAspectClassName}
        storefrontProduct={storefrontProduct}
        variantGid={productVariantGid}
      />
    );
  }

  return null;
}
