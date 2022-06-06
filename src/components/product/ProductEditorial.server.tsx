import {SanityProductPage} from '../../types';
import PortableText from '../PortableText.server';

type Props = {
  sanityProduct: SanityProductPage;
};

export default function ProductEditorial({sanityProduct}: Props) {
  return (
    <div>
      {/* Body */}
      {sanityProduct?.body && (
        <PortableText
          blocks={sanityProduct.body}
          className="my-8 max-w-[660px] px-8"
        />
      )}
    </div>
  );
}
