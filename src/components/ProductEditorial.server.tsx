import {SanityProduct} from '../types';
import DebugWrapper from './DebugWrapper';
import PortableText from './PortableText.client';

type Props = {
  sanityProduct: SanityProduct;
};

export default function ProductEditorial({sanityProduct}: Props) {
  return (
    <DebugWrapper name="Product Editorial">
      {/* Body */}
      {sanityProduct?.body && <PortableText blocks={sanityProduct.body} />}
    </DebugWrapper>
  );
}
