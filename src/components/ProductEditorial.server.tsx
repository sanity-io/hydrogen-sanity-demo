import {SanityProduct} from '../types';
import PortableText from './PortableText.client';

type Props = {
  sanityProduct: SanityProduct;
};

export default function ProductEditorial({sanityProduct}: Props) {
  return (
    <div>
      {/* Body */}
      {sanityProduct?.body && <PortableText blocks={sanityProduct.body} />}
    </div>
  );
}
