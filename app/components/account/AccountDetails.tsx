import type {Customer} from '@shopify/hydrogen/storefront-api-types';
import clsx from 'clsx';

import {Link} from '~/components/Link';

export function AccountDetails({customer}: {customer: Customer}) {
  const {firstName, lastName, email, phone} = customer;

  return (
    <>
      <div>
        <div className="flex items-baseline gap-3">
          <h3 className="align-baseline text-xl font-bold">Profile</h3>
          <Link
            prefetch="intent"
            className="text-sm text-darkGray"
            to="/account/edit"
            preventScrollReset
          >
            Edit
          </Link>
        </div>

        <div className="mt-4 space-y-4">
          <div className="space-y-1">
            <div className="text-sm text-darkGray">Name</div>
            <p
              className={clsx(
                !firstName && !lastName && 'italic text-darkGray',
              )}
            >
              {firstName || lastName
                ? (firstName ? firstName + ' ' : '') + lastName
                : 'Add name'}{' '}
            </p>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-darkGray">Phone</div>
            <p className={clsx(!phone && 'italic text-darkGray')}>
              {phone ?? 'Not added'}
            </p>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-darkGray">Email address</div>
            <p>{email}</p>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-darkGray">Password</div>
            <p>**************</p>
          </div>
        </div>
      </div>
    </>
  );
}
