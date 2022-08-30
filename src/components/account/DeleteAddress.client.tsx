import {useCallback} from 'react';
import useRenderServerComponents from '../../hooks/useRenderServerComponents';
import Button from '../elements/Button';

type Props = {
  addressId: string;
  onClose: () => void;
};

export default function AccountDeleteAddress({addressId, onClose}: Props) {
  // Necessary for edits to show up on the main page
  const renderServerComponents = useRenderServerComponents();

  const deleteAddress = useCallback(
    async (id: string) => {
      const response = await callDeleteAddressApi(id);
      if (response.error) {
        alert(response.error);
        return;
      }
      renderServerComponents();
      onClose();
    },
    [onClose, renderServerComponents],
  );

  const handleConfirmDelete = useCallback(() => {
    if (addressId) {
      deleteAddress(addressId);
    }
  }, [addressId, deleteAddress]);

  return (
    <>
      <h3 className="text-xl font-bold">Confirm removal</h3>

      <p className="my-4">Are you sure you wish to remove this address?</p>

      {/* Footer */}
      <div className="mt-6 flex gap-2">
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleConfirmDelete}>Confirm</Button>
      </div>
    </>
  );
}

export async function callDeleteAddressApi(id: string) {
  try {
    const res = await fetch(`/api/account/address/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
    });
    if (res.ok) {
      return {};
    } else {
      return res.json();
    }
  } catch (_e) {
    return {
      error: 'Error removing address. Please try again.',
    };
  }
}
