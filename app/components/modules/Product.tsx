import type {Product} from '@shopify/hydrogen/storefront-api-types';

import ProductCard from '~/components/product/Card';
import ProductPill from '~/components/product/Pill';
import type {SanityModuleProduct} from '~/lib/sanity';
import {useGid} from '~/lib/utils';

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
  const productGid = module?.productWithVariant?.gid;
  const productVariantGid = module?.productWithVariant?.variantGid;
  const storefrontProduct = useGid<Product>(productGid);

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
