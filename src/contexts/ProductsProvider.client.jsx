import {createContext, useContext} from 'react';

const ProductsContext = createContext();

export default function ProductsProvider({children, value = {}}) {
  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProductsContext(productId) {
  const context = useContext(ProductsContext);

  if (!context) {
    throw new Error('No products context found');
  }

  return context?.[productId];
}
