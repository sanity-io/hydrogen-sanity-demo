import {
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
  useParams,
} from '@remix-run/react';
import {flattenConnection, type SeoHandleFunction} from '@shopify/hydrogen';
import type {
  CustomerAddressCreatePayload,
  CustomerAddressDeletePayload,
  CustomerAddressUpdatePayload,
  CustomerDefaultAddressUpdatePayload,
  MailingAddressInput,
} from '@shopify/hydrogen/storefront-api-types';
import {type ActionFunction, redirect} from '@shopify/remix-oxygen';
import invariant from 'tiny-invariant';

import FormFieldCheckbox from '~/components/account/FormFieldCheckbox';
import FormFieldCountries from '~/components/account/FormFieldCountries';
import FormFieldText from '~/components/account/FormFieldText';
import Button from '~/components/elements/Button';
import {assertApiErrors, badRequest} from '~/lib/utils';

import type {AccountOutletContext} from './($lang).account.edit';

interface ActionData {
  formError?: string;
}

const seo: SeoHandleFunction = ({params}) => {
  return {
    title: params?.id === 'add' ? 'Add address' : 'Update address',
  };
};

export const handle = {
  renderInModal: true,
  seo,
};

export const action: ActionFunction = async ({request, context, params}) => {
  const {storefront, session} = context;
  const formData = await request.formData();

  const customerAccessToken = await session.get('customerAccessToken');
  invariant(customerAccessToken, 'You must be logged in to edit your account.');

  const addressId = formData.get('addressId');
  invariant(typeof addressId === 'string', 'You must provide an address id.');

  if (request.method === 'DELETE') {
    try {
      const data = await storefront.mutate<{
        customerAddressDelete: CustomerAddressDeletePayload;
      }>(DELETE_ADDRESS_MUTATION, {
        variables: {customerAccessToken, id: addressId},
      });

      assertApiErrors(data.customerAddressDelete);

      return redirect(params.lang ? `/${params.lang}/account` : '/account');
    } catch (error: any) {
      return badRequest<ActionData>({formError: error.message});
    }
  }

  const address: MailingAddressInput = {};

  const keys: (keyof MailingAddressInput)[] = [
    'lastName',
    'firstName',
    'address1',
    'address2',
    'city',
    'province',
    'country',
    'zip',
    'phone',
    'company',
  ];

  for (const key of keys) {
    const value = formData.get(key);
    if (typeof value === 'string') {
      address[key] = value;
    }
  }

  const defaultAddress = formData.get('defaultAddress');

  if (addressId === 'add') {
    try {
      const data = await storefront.mutate<{
        customerAddressCreate: CustomerAddressCreatePayload;
      }>(CREATE_ADDRESS_MUTATION, {
        variables: {customerAccessToken, address},
      });

      assertApiErrors(data.customerAddressCreate);

      const newId = data.customerAddressCreate?.customerAddress?.id;
      invariant(newId, 'Expected customer address to be created');

      if (defaultAddress) {
        const data = await storefront.mutate<{
          customerDefaultAddressUpdate: CustomerDefaultAddressUpdatePayload;
        }>(UPDATE_DEFAULT_ADDRESS_MUTATION, {
          variables: {customerAccessToken, addressId: newId},
        });

        assertApiErrors(data.customerDefaultAddressUpdate);
      }

      return redirect(params.lang ? `/${params.lang}/account` : '/account');
    } catch (error: any) {
      return badRequest({formError: error.message});
    }
  } else {
    try {
      const data = await storefront.mutate<{
        customerAddressUpdate: CustomerAddressUpdatePayload;
      }>(UPDATE_ADDRESS_MUTATION, {
        variables: {
          address,
          customerAccessToken,
          id: decodeURIComponent(addressId),
        },
      });

      assertApiErrors(data.customerAddressUpdate);

      if (defaultAddress) {
        const data = await storefront.mutate<{
          customerDefaultAddressUpdate: CustomerDefaultAddressUpdatePayload;
        }>(UPDATE_DEFAULT_ADDRESS_MUTATION, {
          variables: {
            customerAccessToken,
            addressId: decodeURIComponent(addressId),
          },
        });

        assertApiErrors(data.customerDefaultAddressUpdate);
      }

      return redirect(params.lang ? `/${params.lang}/account` : '/account');
    } catch (error: any) {
      return badRequest({formError: error.message});
    }
  }
};

export default function EditAddress() {
  const {id: addressId} = useParams();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const {customer} = useOutletContext<AccountOutletContext>();
  const addresses = flattenConnection(customer.addresses);
  const defaultAddress = customer.defaultAddress;
  /**
   * When a refresh happens (or a user visits this link directly), the URL
   * is actually stale because it contains a special token. This means the data
   * loaded by the parent and passed to the outlet contains a newer, fresher token,
   * and we don't find a match. We update the `find` logic to just perform a match
   * on the first (permanent) part of the ID.
   */
  const normalizedAddress = decodeURIComponent(addressId ?? '').split('?')[0];
  const address = addresses.find((address) =>
    address.id!.startsWith(normalizedAddress),
  );

  return (
    <Form method="post">
      <input type="hidden" name="addressId" value={address?.id ?? addressId} />
      {actionData?.formError && (
        <div className="mb-6 flex items-center justify-center rounded-sm border border-red p-4 text-sm text-red">
          <p>{actionData.formError}</p>
        </div>
      )}
      <div className="space-y-4">
        {/* Country */}
        <FormFieldCountries
          id="country"
          name="country"
          aria-label="Country / region"
          defaultValue={address?.country ?? ''}
          label="Country / region"
        />

        {/* First + last name */}
        <div className="flex w-full gap-3">
          <FormFieldText
            id="firstName"
            name="firstName"
            required
            type="text"
            autoComplete="given-name"
            aria-label="First name"
            defaultValue={address?.firstName ?? ''}
            label="First name"
          />

          <FormFieldText
            id="lastName"
            name="lastName"
            required
            type="text"
            autoComplete="family-name"
            aria-label="Last name"
            defaultValue={address?.lastName ?? ''}
            label="Last name"
          />
        </div>

        <FormFieldText
          id="company"
          name="company"
          type="text"
          autoComplete="organization"
          aria-label="Company"
          defaultValue={address?.company ?? ''}
          label="Company"
        />

        {/* Address 1 */}
        <FormFieldText
          id="address1"
          name="address1"
          type="text"
          autoComplete="address-line1"
          required
          aria-label="Address line 1"
          defaultValue={address?.address1 ?? ''}
          label="Address"
        />

        {/* Address 2 */}
        <FormFieldText
          id="address2"
          name="address2"
          type="text"
          autoComplete="address-line2"
          aria-label="Address line 2"
          defaultValue={address?.address2 ?? ''}
          label="Apartment, suite, etc."
        />

        {/* City / Province / Postal code */}
        <div className="flex gap-3">
          <FormFieldText
            id="city"
            name="city"
            type="text"
            required
            autoComplete="address-level2"
            aria-label="City"
            defaultValue={address?.city ?? ''}
            label="City"
          />

          <FormFieldText
            id="province"
            name="province"
            type="text"
            autoComplete="address-level1"
            required
            aria-label="State"
            defaultValue={address?.province ?? ''}
            label="State / Province"
          />

          <FormFieldText
            id="zip"
            name="zip"
            type="text"
            autoComplete="postal-code"
            required
            aria-label="Zip"
            defaultValue={address?.zip ?? ''}
            label="Postal code"
          />
        </div>

        {/* Phone */}
        <FormFieldText
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="Phone"
          aria-label="Phone"
          defaultValue={address?.phone ?? ''}
          label="Phone"
        />

        {/* Default address */}
        <FormFieldCheckbox
          label="Default address"
          name="defaultAddress"
          id="defaultAddress"
          defaultChecked={defaultAddress?.id === address?.id}
        />
      </div>

      {/* Footer */}
      <div className="mt-10 flex justify-end">
        <div className="flex gap-2">
          <Button to=".." mode="outline" type="button" preventScrollReset>
            Cancel
          </Button>
          <Button disabled={navigation.state !== 'idle'} type="submit">
            {navigation.state !== 'idle' ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </Form>
  );
}

const UPDATE_ADDRESS_MUTATION = `#graphql
  mutation customerAddressUpdate(
    $address: MailingAddressInput!
    $customerAccessToken: String!
    $id: ID!
  ) {
    customerAddressUpdate(
      address: $address
      customerAccessToken: $customerAccessToken
      id: $id
    ) {
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const DELETE_ADDRESS_MUTATION = `#graphql
  mutation customerAddressDelete($customerAccessToken: String!, $id: ID!) {
    customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
      customerUserErrors {
        code
        field
        message
      }
      deletedCustomerAddressId
    }
  }
`;

const UPDATE_DEFAULT_ADDRESS_MUTATION = `#graphql
  mutation customerDefaultAddressUpdate(
    $addressId: ID!
    $customerAccessToken: String!
  ) {
    customerDefaultAddressUpdate(
      addressId: $addressId
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

const CREATE_ADDRESS_MUTATION = `#graphql
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
