// Note: This must be a separate client component from your special Provider component.

import {createContext, useContext} from 'react';

const ProductsContext = createContext();

export default ProductsContext;

export const useProductsContext = (productId) => {
  const context = useContext(ProductsContext);

  if (!context) {
    throw new Error('No products context found');
  }

  return context?.[productId];
};
