// @ts-expect-error incompatibility with node16 resolution
import type {PortableTextBlock} from '@portabletext/types';
import clsx from 'clsx';
import type {SanityModuleProducts} from '../../../types';
import ProductModule from '../../modules/Product.server';

type Props = {
  node: PortableTextBlock & SanityModuleProducts;
};

export default function ProductsBlock({node}: Props) {
  const multipleProducts = node.modules.length > 1;

  return (
    <div
      className={clsx(
        'first:mt-0 last:mb-0', //
        'my-8 grid grid-cols-1 gap-3',
        multipleProducts ? 'md:grid-cols-2' : 'md:grid-cols-1',
      )}
    >
      {node?.modules?.map((module) => (
        <ProductModule
          imageAspectClassName="aspect-[320/220]"
          key={module._key}
          layout={node.layout}
          module={module}
        />
      ))}
    </div>
  );
}
