import {SanityProduct} from '../types';
import DebugWrapper from './DebugWrapper';
import PortableText from './PortableText.client';

type Props = {
  product: SanityProduct;
};

export default function ProductEditorial({product}: Props) {
  return (
    <DebugWrapper name="Product Editorial">
      {/* Body */}
      {product?.body && <PortableText blocks={product.body} />}
    </DebugWrapper>
  );
}
