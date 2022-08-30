import {
  gql,
  type HydrogenApiRouteOptions,
  type HydrogenRequest,
} from '@shopify/hydrogen';
import type {Localization} from '@shopify/hydrogen/storefront-api-types';

export async function api(
  request: HydrogenRequest,
  {queryShop, session}: HydrogenApiRouteOptions,
) {
  if (request.method === 'POST') {
    const {isoCode, name} = await request.json();

    await session?.set('countryCode', isoCode);
    await session?.set('countryName', name);

    return 'success';
  }

  const {
    data: {
      localization: {availableCountries},
    },
  } = await queryShop<{
    localization: Localization;
  }>({
    query: QUERY_SHOPIFY,
  });

  return availableCountries.sort((a, b) => a.name.localeCompare(b.name));
}

const QUERY_SHOPIFY = gql`
  query Localization {
    localization {
      availableCountries {
        isoCode
        name
        currency {
          isoCode
        }
      }
    }
  }
`;
