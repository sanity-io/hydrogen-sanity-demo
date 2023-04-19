import {Form} from '@remix-run/react';
import type {
  Customer,
  MailingAddress,
} from '@shopify/hydrogen/storefront-api-types';

import Badge from '~/components/elements/Badge';
import Button from '~/components/elements/Button';
import {Link} from '~/components/Link';

export function AccountAddressBook({
  customer,
  addresses,
}: {
  customer: Customer;
  addresses: MailingAddress[];
}) {
  return (
    <>
      <div className="grid w-full">
        <h3 className="text-xl font-bold">Address Book</h3>
        <div>
          {!addresses?.length && (
            <p>You haven&apos;t saved any addresses yet.</p>
          )}
          {Boolean(addresses?.length) && (
            <div className="my-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {customer.defaultAddress && (
                <Address address={customer.defaultAddress} defaultAddress />
              )}
              {addresses
                .filter((address) => address.id !== customer.defaultAddress?.id)
                .map((address) => (
                  <Address key={address.id} address={address} />
                ))}
            </div>
          )}
          <Button
            to="/account/address/add"
            className="inline-flex"
            preventScrollReset
          >
            Add Address
          </Button>
        </div>
      </div>
    </>
  );
}

function Address({
  address,
  defaultAddress,
}: {
  address: MailingAddress;
  defaultAddress?: boolean;
}) {
  return (
    <div className="flex flex-col rounded border border-darkGray/50 p-4">
      {defaultAddress && (
        <div className="mb-3 inline-flex">
          <Badge mode="outline" label="Default" small />
        </div>
      )}
      <ul className="flex-1 flex-row space-y-1">
        {(address.firstName || address.lastName) && (
          <li className="font-bold">
            {'' +
              (address.firstName && address.firstName + ' ') +
              address?.lastName}
          </li>
        )}
        {address.formatted &&
          address.formatted.map((line: string) => <li key={line}>{line}</li>)}
      </ul>

      <div className="mt-10 flex flex-row text-sm font-medium text-darkGray">
        <Link
          to={`/account/address/${encodeURIComponent(address.id)}`}
          className="text-left text-sm"
          prefetch="intent"
          preventScrollReset
        >
          Edit address
        </Link>
        <Form action="/account/address/delete" method="delete">
          <input type="hidden" name="addressId" value={address.id} />
          <button className="ml-6 text-left text-sm text-red">
            Remove address
          </button>
        </Form>
      </div>
    </div>
  );
}
