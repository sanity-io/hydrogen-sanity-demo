import clsx from 'clsx';
import type {SanityColorTheme, SanityProductPage} from '../../types';
import PortableText from '../portableText/PortableText.server';

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
          className={clsx(
            'my-8 max-w-[660px] px-4', //
            'md:px-8',
          )}
          colorTheme={colorTheme}
        />
      )}
    </div>
  );
}
