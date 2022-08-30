import {Seo} from '@shopify/hydrogen';
import clsx from 'clsx';
import {useCallback, useState} from 'react';
import ProfileForm from './forms/Profile.client';
import FormDialog from './FormDialog.client';

type Props = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
};

export default function AccountProfile({
  firstName,
  lastName,
  phone,
  email,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);

  const handleDialogClose = useCallback(() => {
    setIsEditing(false);
  }, []);

  let fullName = '';
  if (firstName) {
    fullName += firstName + ' ';
  }
  if (lastName) {
    fullName += lastName;
  }

  return (
    <>
      {/* Dialog  */}
      <FormDialog
        onClose={handleDialogClose}
        title="Update profile"
        visible={isEditing}
      >
        <Seo type="noindex" data={{title: 'Account details'}} />
        <ProfileForm
          email={email}
          firstName={firstName}
          lastName={lastName}
          onClose={handleDialogClose}
          phone={phone}
        />
      </FormDialog>

      <div>
        <div className="flex items-baseline gap-3">
          <h3 className="align-baseline text-xl font-bold">Profile</h3>
          <button
            className="linkTextNavigation text-sm text-darkGray"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div className="space-y-1">
            <div className="text-sm text-darkGray">Name</div>
            <p className={clsx(!fullName && 'italic text-darkGray')}>
              {fullName || 'Not added'}
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
