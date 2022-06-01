import {Product} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import type {SanityModule} from '../types';

const MODULE_INTERVAL = 2;

export function combineProductsAndModules({
  modules,
  products,
}: {
  products: Product[];
  modules?: SanityModule[];
}) {
  let moduleIndex = 0;
  return products.reduce<(SanityModule | Product)[]>((acc, val, index) => {
    if ((index + 1) % MODULE_INTERVAL === 0) {
      const nextModule = modules?.[moduleIndex];
      if (nextModule) {
        acc.push(nextModule);
        moduleIndex += 1;
      }
    }
    acc.push(val);
    return acc;
  }, []);
}
