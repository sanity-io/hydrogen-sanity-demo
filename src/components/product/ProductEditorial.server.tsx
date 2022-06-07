import {SanityColorTheme, SanityProductPage} from '../../types';
import PortableText from '../PortableText.server';

type Props = {
  colorTheme?: SanityColorTheme;
  sanityProduct: SanityProductPage;
};

export default function ProductEditorial({colorTheme, sanityProduct}: Props) {
  return (
    <div>
      {/* Body */}
      {sanityProduct?.body && (
        <PortableText
          blocks={sanityProduct.body}
          className="my-8 max-w-[660px] px-8"
          colorTheme={colorTheme}
        />
      )}
    </div>
  );
}
