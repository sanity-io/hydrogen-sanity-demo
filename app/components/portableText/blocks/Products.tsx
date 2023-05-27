import type {PortableTextBlock} from '@portabletext/types';
import clsx from 'clsx';

import ProductModule from '~/components/modules/Product';
import type {SanityModuleProducts} from '~/lib/sanity';

type Props = {
  value: PortableTextBlock & SanityModuleProducts;
};

export default function ProductsBlock({value}: Props) {
  if (!Array.isArray(value?.modules)) {
    return null;
  }

  const multipleProducts = value.modules.length > 1;

  return (
    <div
      className={clsx(
        'first:mt-0 last:mb-0', //
        'my-8 grid grid-cols-1 gap-3',
        multipleProducts ? 'md:grid-cols-2' : 'md:grid-cols-1',
      )}
    >
      {value?.modules?.map((module) => (
        <ProductModule
          imageAspectClassName="aspect-[320/220]"
          key={module._key}
          layout={value.layout}
          module={module}
        />
      ))}
    </div>
  );
}
