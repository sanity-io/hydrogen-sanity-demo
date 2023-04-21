import clsx from 'clsx';

import ProductCard from '~/components/product/Card';
import type {SanityColorTheme} from '~/lib/sanity';
import type {ProductWithNodes} from '~/types/shopify';

type Props = {
  colorTheme?: SanityColorTheme;
  relatedProducts: ProductWithNodes[];
};

export default function RelatedProducts({colorTheme, relatedProducts}: Props) {
  const products = relatedProducts && relatedProducts?.slice(0, 4);

  return (
    <div
      className={clsx(
        'rounded-t-xl px-4 py-8', //
        'md:px-8',
      )}
      style={{background: colorTheme?.background || 'white'}}
    >
      <h3
        className={clsx(
          'mb-6 text-lg font-bold', //
          'md:text-xl',
        )}
      >
        Related products
      </h3>
      <div
        className={clsx(
          'grid grid-cols-2 gap-3 pb-6', //
          'md:grid-cols-4',
        )}
      >
        {products.map((product) => (
          <ProductCard key={product.id} storefrontProduct={product} />
        ))}
      </div>
    </div>
  );
}
