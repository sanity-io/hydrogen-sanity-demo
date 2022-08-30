import {
  CacheNone,
  gql,
  Seo,
  type HydrogenApiRouteOptions,
  type HydrogenRequest,
  type HydrogenRouteProps,
} from '@shopify/hydrogen';
import type {CustomerCreatePayload} from '@shopify/hydrogen/storefront-api-types';
import {Suspense} from 'react';
import RegisterForm from '../../components/account/forms/Register.client';
import Layout from '../../components/global/Layout.server';
import {getApiCustomerErrorMessage} from '../../utils/getApiCustomerErrorMessage';

export default function Register({response}: HydrogenRouteProps) {
  response.cache(CacheNone());

  return (
    <Layout>
      <Suspense>
        <Seo type="noindex" data={{title: 'Register'}} />
      </Suspense>
      <RegisterForm />
    </Layout>
  );
}

export async function api(
  request: HydrogenRequest,
  {queryShop}: HydrogenApiRouteOptions,
) {
  const jsonBody = await request.json();

  if (
    !jsonBody.email ||
    jsonBody.email === '' ||
    !jsonBody.password ||
    jsonBody.password === ''
  ) {
    return new Response(
      JSON.stringify({error: 'Email and password are required'}),
      {status: 400},
    );
  }

  const {data, errors} = await queryShop<{
    customerCreate: CustomerCreatePayload;
  }>({
    query: MUTATION_SHOPIFY_CUSTOMER_CREATE,
    variables: {
      input: {
        email: jsonBody.email,
        password: jsonBody.password,
        firstName: jsonBody.firstName,
        lastName: jsonBody.lastName,
      },
    },
    // @ts-expect-error `queryShop.cache` is not yet supported but soon will be.
    cache: CacheNone(),
  });

  const errorMessage = getApiCustomerErrorMessage(
    'customerCreate',
    data,
    errors,
  );

  if (
    !errorMessage &&
    data &&
    data.customerCreate &&
    data.customerCreate.customer &&
    data.customerCreate.customer.id
  ) {
    return new Response(null, {
      status: 200,
    });
  } else {
    return new Response(
      JSON.stringify({
        error: errorMessage ?? 'Unknown error',
      }),
      {status: 401},
    );
  }
}

const MUTATION_SHOPIFY_CUSTOMER_CREATE = gql`
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;
