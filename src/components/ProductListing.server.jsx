import clsx from 'clsx';
import ProductCard from './ProductCard.server';

export default function ProductListing({products}) {
  return (
    <section
      className={clsx([
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        'gap-10 my-8',
      ])}
    >
      {(!products || products.length === 0) && <div>No products</div>}

      {products?.map((product) => {
        return (
          <div key={product?._id}>
            <ProductCard product={product} />
          </div>
        );
      })}
    </section>
  );
}
