import ProductsContext from './ProductsContext.client';

const ProductsProvider = ({children, value = {}}) => {
  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

export default ProductsProvider;
