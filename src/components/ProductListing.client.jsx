import ProductCard from './ProductCard.client';

export default function ProductListing({products}) {
  return (
    <section className="gap-10 grid grid-cols-3 my-8">
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
