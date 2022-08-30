import {
  CacheNone,
  gql,
  type HydrogenApiRouteOptions,
  type HydrogenRequest,
} from '@shopify/hydrogen';
import {CustomerAddressCreatePayload} from '@shopify/hydrogen/storefront-api-types';
import {getApiCustomerErrorMessage} from '../../../../utils/getApiCustomerErrorMessage';
import {setDefaultAddress} from './[addressId].server';

export interface Address {
  firstName?: string;
  lastName?: string;
  company?: string;
  address1?: string;
  address2?: string;
  country?: string;
  province?: string;
  city?: string;
  zip?: string;
  phone?: string;
}

export async function api(
  request: HydrogenRequest,
  {session, queryShop}: HydrogenApiRouteOptions,
) {
  if (request.method !== 'POST') {
    return new Response(null, {
      status: 405,
      headers: {
        Allow: 'POST',
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

  const {
    address1,
    address2,
    city,
    company,
    country,
    firstName,
    lastName,
    isDefaultAddress,
    phone,
    province,
    zip,
  } = await request.json();

  const address: Address = {};

  if (firstName) address.firstName = firstName;
  if (lastName) address.lastName = lastName;
  if (company) address.company = company;
  if (address1) address.address1 = address1;
  if (address2) address.address2 = address2;
  if (country) address.country = country;
  if (province) address.province = province;
  if (city) address.city = city;
  if (zip) address.zip = zip;
  if (phone) address.phone = phone;

  const {data, errors} = await queryShop<{
    customerAddressCreate: CustomerAddressCreatePayload;
  }>({
    query: MUTATION_SHOPIFY_CREATE_ADDRESS,
    variables: {
      address,
      customerAccessToken,
    },
    // @ts-expect-error `queryShop.cache` is not yet supported but soon will be.
    cache: CacheNone(),
  });

  const customerAddressId = data.customerAddressCreate.customerAddress?.id;

  const error = getApiCustomerErrorMessage(
    'customerAddressCreate',
    data,
    errors,
  );

  if (error) return new Response(JSON.stringify({error}), {status: 400});

  if (isDefaultAddress && customerAddressId) {
    const {data: responseData, errors: responseErrors} =
      await setDefaultAddress(
        queryShop,
        customerAddressId,
        customerAccessToken,
      );

    const responseError = getApiCustomerErrorMessage(
      'customerDefaultAddressUpdate',
      responseData,
      responseErrors,
    );

    if (responseError)
      return new Response(JSON.stringify({error}), {status: 400});
  }

  return new Response(null);
}

const MUTATION_SHOPIFY_CREATE_ADDRESS = gql`
  mutation customerAddressCreate(
    $address: MailingAddressInput!
    $customerAccessToken: String!
  ) {
    customerAddressCreate(
      address: $address
      customerAccessToken: $customerAccessToken
    ) {
      customerAddress {
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
