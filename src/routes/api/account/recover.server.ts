import {
  CacheNone,
  gql,
  type HydrogenApiRouteOptions,
  type HydrogenRequest,
} from '@shopify/hydrogen';

export async function api(
  request: HydrogenRequest,
  {queryShop}: HydrogenApiRouteOptions,
) {
  const jsonBody = await request.json();

  if (!jsonBody.email || jsonBody.email === '') {
    return new Response(JSON.stringify({error: 'Email required'}), {
      status: 400,
    });
  }

  await queryShop({
    query: CUSTOMER_RECOVER_MUTATION,
    variables: {
      email: jsonBody.email,
    },
    // @ts-expect-error `queryShop.cache` is not yet supported but soon will be.
    cache: CacheNone(),
  });

  // Ignore errors, we don't want to tell the user if the email was
  // valid or not, thereby allowing them to determine who uses the site
  return new Response(null, {
    status: 200,
  });
}

const CUSTOMER_RECOVER_MUTATION = gql`
  mutation customerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;
