import {
  CacheNone,
  gql,
  type HydrogenApiRouteOptions,
  type HydrogenRequest,
} from '@shopify/hydrogen';
import type {
  Customer,
  CustomerUpdatePayload,
} from '@shopify/hydrogen/storefront-api-types';
import {getApiCustomerErrorMessage} from '../../../utils/getApiCustomerErrorMessage';

type CustomerWithPassword = Pick<
  Customer,
  'email' | 'phone' | 'firstName' | 'lastName'
> & {
  password?: string;
};

export async function api(
  request: HydrogenRequest,
  {session, queryShop}: HydrogenApiRouteOptions,
) {
  if (request.method !== 'PATCH' && request.method !== 'DELETE') {
    return new Response(null, {
      status: 405,
      headers: {
        Allow: 'PATCH,DELETE',
      },
    });
  }

  if (!session) {
    return new Response('Session storage not available.', {
      status: 400,
    });
  }

  const {customerAccessToken} = await session.get();

  if (!customerAccessToken) return new Response(null, {status: 401});

  const {email, phone, firstName, lastName, newPassword} = await request.json();

  const customer: CustomerWithPassword = {};

  if (email) customer.email = email;
  if (phone) customer.phone = phone;
  if (firstName) customer.firstName = firstName;
  if (lastName) customer.lastName = lastName;
  if (newPassword) customer.password = newPassword;

  const {data, errors} = await queryShop<{
    customerUpdate: CustomerUpdatePayload;
  }>({
    query: CUSTOMER_UPDATE_MUTATION,
    variables: {
      customer,
      customerAccessToken,
    },
    // @ts-expect-error `queryShop.cache` is not yet supported but soon will be.
    cache: CacheNone(),
  });

  const error = getApiCustomerErrorMessage('customerUpdate', data, errors);

  if (error) return new Response(JSON.stringify({error}), {status: 400});

  return new Response(null);
}

const CUSTOMER_UPDATE_MUTATION = gql`
  mutation customerUpdate(
    $customer: CustomerUpdateInput!
    $customerAccessToken: String!
  ) {
    customerUpdate(
      customer: $customer
      customerAccessToken: $customerAccessToken
    ) {
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;
