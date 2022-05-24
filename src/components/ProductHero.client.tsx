import {SanityProduct} from '../types';
import DebugWrapper from './DebugWrapper';
import Gallery from './Gallery.client';
import ProductWidget from './ProductWidget.client';

type Props = {
  sanityProduct: SanityProduct;
};

export default function ProductHero({sanityProduct}: Props) {
  return (
    <DebugWrapper name="Product Details" shopify>
      <div className="mb-16 grid grid-cols-1 gap-x-8 md:grid-cols-[2fr,1fr]">
        <Gallery />

        <div>
          <ProductWidget sanityProduct={sanityProduct} />
        </div>
      </div>
    </DebugWrapper>
  );
}
