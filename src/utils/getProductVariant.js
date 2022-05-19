import {flattenConnection} from '@shopify/hydrogen';

// Sourced from `shopify-gid`:
// https://github.com/estrattonbailey/shopify-gid/blob/master/index.js
function encode(type, id, params = {}) {
  let full = `gid://shopify/${type}/${id}`;

  let query = [];
  const keys = Object.keys(params);

  if (keys.length > 0) {
    for (let i = 0; i < keys.length; i++) {
      query.push(keys[i] + '=' + params[keys[i]]);
    }

    query = '?' + query.join('&');

    full += query;
  }

  return typeof window === 'undefined'
    ? Buffer.from(full, 'utf-8').toString('base64')
    : btoa(full);
}

/**
 * Extract a variant from a Storefront product, given a variant ID number.
 *
 * @param {string}  product - The Storefront product
 * @param {number}  variantId - Product Variant ID number
 *
 * Currently, IDs returned by the Storefront API can either be:
 * - a base64 encoded object ID ("Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzE=")
 * - a non-encoded GID ("gid://shopify/Product/1")
 *
 * The `2022-04` release of Storefront API will only return non-encoded gids but
 * until then, we assume that it can return either value.
 *
 * More context: https://shopify.dev/api/examples/object-ids
 */

export function getProductVariant(product, variantId) {
  // Get a base64 encoded ID of our variant ID
  const idEncoded = encode('ProductVariant', variantId);

  // Also construct a non-encoded GID
  const gid = `gid://shopify/ProductVariant/${variantId}`;

  // Flatten nodes and find the first occurance of any variant that matches either ID format
  const variants = flattenConnection(product.variants);
  return variants.find((variant) => [idEncoded, gid].includes(variant.id));
}
