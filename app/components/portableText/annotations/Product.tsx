import type {PortableTextMarkComponentProps} from '@portabletext/react';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

import ProductInlineLink from '~/components/portableText/annotations/ProductInlineLink';
import type {SanityProductWithVariant} from '~/lib/sanity';
import {useGid} from '~/lib/utils';

type Props = PortableTextMarkComponentProps & {
  value: PortableTextMarkComponentProps['value'] & {
    linkAction: 'addToCart' | 'buyNow' | 'link';
    productWithVariant: SanityProductWithVariant;
    quantity?: number;
  };
};

const ProductAnnotation = ({children, value}: Props) => {
  const {productWithVariant} = value;

  const productGid = productWithVariant?.gid;
  const productVariantGid = productWithVariant?.variantGid;
  const storefrontProduct = useGid<Product>(productGid);

  if (!productGid || !storefrontProduct) {
    return <>{children}</>;
  }

  return (
    <ProductInlineLink
      linkAction={value.linkAction || 'link'}
      quantity={value.quantity}
      storefrontProduct={storefrontProduct}
      variantGid={productVariantGid}
    >
      <>{children}</>
    </ProductInlineLink>
  );
};

export default ProductAnnotation;
