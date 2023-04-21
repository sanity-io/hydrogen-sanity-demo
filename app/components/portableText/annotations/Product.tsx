import type {PortableTextMarkComponentProps} from '@portabletext/react';
import {useMatches} from '@remix-run/react';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

import ProductInlineLink from '~/components/portableText/annotations/ProductInlineLink';
import type {SanityColorTheme, SanityProductWithVariant} from '~/lib/sanity';

type Props = PortableTextMarkComponentProps & {
  colorTheme?: SanityColorTheme;
  value: PortableTextMarkComponentProps['value'] & {
    linkAction: 'addToCart' | 'buyNow' | 'link';
    productWithVariant: SanityProductWithVariant;
    quantity?: number;
  };
};

const ProductAnnotation = ({children, colorTheme, value}: Props) => {
  const {productWithVariant} = value;

  const storefrontData =
    useMatches().find((match) => match.data?.storefrontData)?.data
      ?.storefrontData || {};

  const productGid = productWithVariant.gid;
  const productVariantGid = productWithVariant.variantGid;

  const storefrontProduct = storefrontData.products.find(
    (product: Product) => product.id === productGid,
  );

  if (!storefrontProduct) {
    return <>{children}</>;
  }

  return (
    <ProductInlineLink
      colorTheme={colorTheme}
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
