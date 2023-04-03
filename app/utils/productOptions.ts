import {ProductOption} from '@shopify/hydrogen/storefront-api-types';
import pluralize from 'pluralize-esm';

export const hasMultipleProductOptions = (options?: ProductOption[]) => {
  const firstOption = options?.[0];
  if (!firstOption) {
    return false;
  }

  return (
    firstOption.name !== 'Title' && firstOption.values[0] !== 'Default Title'
  );
};

export const getProductOptionString = (options?: ProductOption[]) => {
  return options
    ?.map(({name, values}) => pluralize(name, values.length, true))
    .join(' / ');
};
