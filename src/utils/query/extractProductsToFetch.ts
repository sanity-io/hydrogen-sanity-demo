const PRODUCT_PATTERN = 'shopifyProduct-';
// @TODO: should we extract variants as well?
// const VARIANT_PATTERN = 'shopifyVariant-';

export interface ProductToFetch {
  shopifyId: string;
  sanityId: string;

  /**
   * Places where has this product been found.
   * It's an array of
   */
  occurrences: unknown[][];
}

const ensureShopifyId = (id: string): string => {
  return id.replace(PRODUCT_PATTERN, '');
};

const ensureSanityId = (id: string): string => {
  return `${PRODUCT_PATTERN}${ensureShopifyId(id)}`;
};

const stringToIds = (str: string): string[] => {
  if (typeof str !== 'string') {
    return [];
  }
  const expression = new RegExp(`${PRODUCT_PATTERN}[\\w\\d]*`, 'gm');
  const matches = (str.match(expression) || []).filter(Boolean);

  if (!Array.isArray(matches) || matches.length <= 0) {
    return [];
  }

  return matches;
};

/**
 * Gets a flat array with every occurrence of shopify products, together with their Sanity & Shopify IDs & occurrences.
 */
const findProductsToFetch = (
  data: unknown,
  parents: unknown[] = [],
): ProductToFetch[] => {
  if (typeof data === 'undefined' || data === null) {
    return [];
  }

  if (typeof data === 'string') {
    // @TODO: only add ID if in `_ref` & `_id`
    // const ids = stringToIds(data)
    // if (ids.length) {
    //   console.log({ ids, parents })
    // }
    return stringToIds(data).map((id) => ({
      sanityId: ensureSanityId(id),
      shopifyId: ensureShopifyId(id),
      // @TODO: should we include the current string in occurrences?
      // occurrences: [[data, ...parents]],
      occurrences: [parents],
    }));
  }

  if (Array.isArray(data)) {
    return data
      .map((entry) => findProductsToFetch(entry, [data, ...parents]))
      .flat();
  }

  if (typeof data === 'object') {
    return Object.keys(data)
      .map((key) => findProductsToFetch(data[key], [data, ...parents]))
      .flat();
  }

  return [];
};

/**
 * Consolidate Shopify products found into an Object with ids as keys.
 */
const extractProductsToFetch = (data: unknown): ProductsToFetch => {
  const toFetch = findProductsToFetch(data).filter(
    (product) =>
      Boolean(product.shopifyId) &&
      Boolean(product.sanityId) &&
      Array.isArray(product.occurrences),
  );

  return toFetch.reduce((consolidated, curProduct) => {
    const existingOccurrences =
      consolidated[curProduct.shopifyId]?.occurrences || [];
    return {
      ...consolidated,
      [curProduct.shopifyId]: {
        ...curProduct,
        occurrences: [...existingOccurrences, ...curProduct.occurrences],
      },
    };
  }, {} as ProductsToFetch);
};

export default extractProductsToFetch;
