import {ProductDescription} from '@shopify/hydrogen/client';
import {SanityProduct} from '../types';
import DebugWrapper from './DebugWrapper';
import Gallery from './Gallery.client';
import ProductMetafields from './ProductMetafields.client';
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
          <ProductMetafields />
          <ProductDescription className="prose" />
        </div>
      </div>
    </DebugWrapper>
  );
}
