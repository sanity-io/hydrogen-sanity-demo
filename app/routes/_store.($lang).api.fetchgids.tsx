import {extract} from '@sanity/mutator';
import type {
  Collection,
  Product,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';
import {json, type LoaderArgs} from '@shopify/remix-oxygen';
import {isPreviewModeEnabled} from 'hydrogen-sanity';

import {notFound, validateLocale} from '~/lib/utils';
import {PRODUCTS_AND_COLLECTIONS} from '~/queries/shopify/product';

type StorefrontPayload = {
  productsAndCollections: Product[] | Collection[];
};

export async function action({params, context, request}: LoaderArgs) {
  const isPreview = isPreviewModeEnabled(context.sanity.preview);

  if (!isPreview) {
    throw notFound();
  }

  validateLocale({context, params});
  const formData = await request.formData();
  const ids = formData.get('ids') as string;

  const {productsAndCollections} =
    await context.storefront.query<StorefrontPayload>(
      PRODUCTS_AND_COLLECTIONS,
      {
        variables: {
          ids: ids ? JSON.parse(ids) : [],
        },
      },
    );

  return json(
    extract(`..[id?]`, productsAndCollections) as (
      | Product
      | Collection
      | ProductVariant
    )[],
  );
}

export function loader() {
  throw notFound();
}

export default function FetchGids() {
  return <></>;
}
