import type {PortableTextBlock} from '@portabletext/types';
import clsx from 'clsx';

import type {SanityModuleProducts} from '~/types/sanity';

// import ProductModule from '../../modules/Product';

type Props = {
  value: PortableTextBlock & SanityModuleProducts;
};

export default function ProductsBlock({value}: Props) {
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
        // TODO: sort product module with API calls
        <p key={module._key}>product here</p>
        // <ProductModule
        //   imageAspectClassName="aspect-[320/220]"
        //   key={module._key}
        //   layout={value.layout}
        //   module={module}
        // />
      ))}
    </div>
  );
}
