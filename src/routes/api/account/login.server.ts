import {
  CacheNone,
  gql,
  type HydrogenApiRouteOptions,
  type HydrogenRequest,
} from '@shopify/hydrogen';
import type {CustomerAccessTokenCreatePayload} from '@shopify/hydrogen/storefront-api-types';

export async function api(
  request: HydrogenRequest,
  {session, queryShop}: HydrogenApiRouteOptions,
) {
  if (!session) {
    return new Response('Session storage not available.', {status: 400});
  }

  const jsonBody = await request.json();

  if (
    !jsonBody.email ||
    jsonBody.email === '' ||
    !jsonBody.password ||
    jsonBody.password === ''
  ) {
    return new Response(
      JSON.stringify({error: 'Incorrect email or password.'}),
      {status: 400},
    );
  }

  const {data, errors} = await queryShop<{
    customerAccessTokenCreate: CustomerAccessTokenCreatePayload;
  }>({
    query: MUTATION_SHOPIFY_LOGIN,
    variables: {
      input: {
        email: jsonBody.email,
        password: jsonBody.password,
      },
    },
    // @ts-expect-error `queryShop.cache` is not yet supported but soon will be.
    cache: CacheNone(),
  });

  if (data?.customerAccessTokenCreate?.customerAccessToken?.accessToken) {
    await session.set(
      'customerAccessToken',
      data.customerAccessTokenCreate.customerAccessToken.accessToken,
    );

    return new Response(null, {
      status: 200,
    });
  } else {
    return new Response(
      JSON.stringify({
        error: data?.customerAccessTokenCreate?.customerUserErrors ?? errors,
      }),
      {status: 401},
    );
  }
}

const MUTATION_SHOPIFY_LOGIN = gql`
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerUserErrors {
        code
        field
        message
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
    }
  }
`;
