import type {Collection, Product} from '@shopify/hydrogen/storefront-api-types';
import {AppLoadContext} from '@shopify/remix-oxygen';
import {reduceDeep} from 'deepdash-es/standalone';

import {PRODUCTS_AND_COLLECTIONS} from '~/queries/shopify/product';
import {
  SanityCollectionPage,
  SanityPage,
  SanityProductPage,
} from '~/types/sanity';

type ShopifyPayload = {
  products: Product[];
  collections: Collection[];
};

export const getPageData = async ({
  page,
  context,
}: {
  page: SanityPage | SanityCollectionPage | SanityProductPage;
  context: AppLoadContext;
}) => {
  const [productGids, collectionGids] = reduceDeep(
    page,
    (acc, value) => {
      if (value?._type == 'productWithVariant') {
        acc[0].push(value.gid);
      }
      if (value?._type == 'collection') {
        acc[1].push(value.gid);
      }
      return acc;
    },
    [[], []],
  );

  const {products, collections}: ShopifyPayload =
    await context.storefront.query(PRODUCTS_AND_COLLECTIONS, {
      variables: {
        ids: productGids,
        collectionIds: collectionGids,
      },
    });

  return {
    products,
    collections,
  };
};
