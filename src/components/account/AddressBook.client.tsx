import {useCallback, useMemo, useState} from 'react';
import type {MailingAddressExtended} from '../../types';
import Badge from '../elements/Badge';
import Button from '../elements/Button';
import FormDialog from './FormDialog.client';
import AddressForm from './forms/Address.client';

type Props = {
  addresses: MailingAddressExtended[];
  defaultAddressGid?: string;
};

export default function AccountAddressBook({
  addresses,
  defaultAddressGid,
}: Props) {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingAddress, setAddress] =
    useState<Partial<MailingAddressExtended> | null>(null);

  const {fullDefaultAddress, addressesWithoutDefault} = useMemo(() => {
    const defaultAddressIndex = addresses.findIndex(
      (address) => address.id === defaultAddressGid,
    );
    return {
      addressesWithoutDefault: [
        ...addresses.slice(0, defaultAddressIndex),
        ...addresses.slice(defaultAddressIndex + 1, addresses.length),
      ],
      fullDefaultAddress: addresses[defaultAddressIndex],
    };
  }, [addresses, defaultAddressGid]);

  const handleEditAddress = useCallback(
    (address: Partial<MailingAddressExtended>) => {
      setDialogVisible(true);
      setAddress(address);
    },
    [],
  );

  const handleCreateAddress = useCallback(() => {
    // Edit an empty address
    handleEditAddress({});
  }, [handleEditAddress]);

  const handleClearAddress = useCallback(() => {
    setAddress(null);
  }, []);

  const handleDialogClose = useCallback(() => {
    setDialogVisible(false);
  }, []);

  const isNewAddress = useMemo(
    () => editingAddress && !Object.keys(editingAddress).length,
    [editingAddress],
  );

  return (
    <>
      {/* Dialog */}
      <FormDialog
        onAfterLeave={handleClearAddress}
        onClose={handleDialogClose}
        title={isNewAddress ? 'Add address' : 'Edit address'}
        visible={dialogVisible}
      >
        {editingAddress && (
          <AddressForm
            address={editingAddress}
            isDefaultAddress={fullDefaultAddress === editingAddress}
            onClose={handleDialogClose}
          />
        )}
      </FormDialog>

      <div className="grid w-full">
        <h3 className="text-xl font-bold">Address Book</h3>
        <div>
          {!addresses?.length && (
            <p className="my-4">You haven&apos;t saved any addresses yet.</p>
          )}

          {/* Addresses */}
          {addresses?.length > 0 && (
            <div className="my-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {fullDefaultAddress && (
                <Address
                  address={fullDefaultAddress}
                  defaultAddress
                  editAddress={handleEditAddress}
                />
              )}

              {addressesWithoutDefault.map((address) => (
                <Address
                  key={address.id}
                  address={address}
                  editAddress={handleEditAddress}
                />
              ))}
            </div>
          )}

          <Button onClick={handleCreateAddress}>Add Address</Button>
        </div>
      </div>
    </>
  );
}

function Address({
  address,
  defaultAddress,
  editAddress,
}: {
  address: MailingAddressExtended;
  defaultAddress?: boolean;
  editAddress: (address: MailingAddressExtended) => void;
}) {
  const handleEditAddress = useCallback(() => {
    editAddress(address);
  }, [address, editAddress]);

  let fullName = '';
  if (address?.firstName) {
    fullName += address.firstName + ' ';
  }
  if (address?.lastName) {
    fullName += address.lastName;
  }

  return (
    <div className="flex flex-col rounded border border-darkGray/50 p-4">
      {/* Default badge */}
      {defaultAddress && (
        <div className="mb-3 inline-flex">
          <Badge mode="outline" label="Default" small />
        </div>
      )}

      {/* Address fields */}
      <ul className="flex-1 flex-row space-y-1">
        {fullName && <li className="font-bold">{fullName}</li>}

        {address.formatted &&
          address.formatted.map((line: string) => <li key={line}>{line}</li>)}
      </ul>

      {/* Footer */}
      <div className="mt-10 flex flex-row text-sm font-medium text-darkGray">
        <button className="linkTextNavigation" onClick={handleEditAddress}>
          Edit address
        </button>
      </div>
    </div>
  );
}
