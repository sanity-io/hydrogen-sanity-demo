import {useMatches} from '@remix-run/react';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

import ProductCard from '~/components/product/Card';
import ProductPill from '~/components/product/Pill';
import type {SanityModuleProduct} from '~/lib/sanity';

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
