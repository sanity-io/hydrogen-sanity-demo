import {ProductOptionsProvider} from '@shopify/hydrogen';
import type {ProductVariant} from '@shopify/hydrogen/storefront-api-types';
import {ReactNode} from 'react';
import type {ProductWithNodes} from '../types';

type Props = {
  children: ReactNode;
  data: ProductWithNodes;
  initialVariantId?: ProductVariant['id'];
};

export default function ProductOptionsWrapper({
  children,
  data,
  initialVariantId,
}: Props) {
  return (
    <ProductOptionsProvider data={data} initialVariantId={initialVariantId}>
      {children}
    </ProductOptionsProvider>
  );
}
