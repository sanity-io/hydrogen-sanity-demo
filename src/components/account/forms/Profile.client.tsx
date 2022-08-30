import {yupResolver} from '@hookform/resolvers/yup';
import {useCallback} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import * as yup from 'yup';
import useRenderServerComponents from '../../../hooks/useRenderServerComponents';
import Button from '../../elements/Button';
import FormFieldText from '../FormFieldText.client';
import sanitizeFormObject from '../utils/sanitizeFormObject';

type FormValues = {
  currentPassword?: string;
  firstName?: string;
  lastName?: string;
  newPassword?: string;
  newPasswordRepeat?: string;
  phone?: string;
  email?: string;
};

type Props = {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  onClose: () => void;
};

const schema = yup
  .object({
    currentPassword: yup.string().when('newPassword', {
      is: (field: string) => field.length > 0,
      then: yup.string().required('Please enter your current password'),
    }),
    email: yup.string().email('Please enter a valid email'),
    firstName: yup.string().required('Please enter your first name'),
    lastName: yup.string().required('Please enter your last name'),
    newPassword: yup
      .string()
      .test(
        'empty-or-min-length-check',
        'Passwords must have at least 5 characters',
        (field) => !field || field.length >= 5,
      ),
    newPasswordRepeat: yup.string().when('newPassword', {
      is: (field: string) => field.length > 0,
      then: yup
        .string()
        .oneOf([yup.ref('newPassword')], 'Passwords must match'),
    }),
    phone: yup.string(),
  })
  .required();

export default function ProfileForm({
  email,
  firstName,
  lastName,
  onClose,
  phone,
}: Props) {
  const {
    formState: {errors, isDirty, isSubmitting, isSubmitSuccessful},
    handleSubmit,
    register,
    setError,
  } = useForm<
    FormValues & {
      serverError?: string;
    }
  >({
    defaultValues: sanitizeFormObject({
      email,
      firstName,
      lastName,
      phone,
    }),
    resolver: yupResolver(schema),
  });

  // Necessary for edits to show up on the main page
  const renderServerComponents = useRenderServerComponents();

  const handleUpdate: SubmitHandler<FormValues> = useCallback(
    async (formData) => {
      const response = await callAccountUpdateApi(formData);

      if (response.error) {
        setError('serverError', {
          message: response.error,
          type: 'custom',
        });
        return;
      }

      renderServerComponents();
      onClose();
    },
    [onClose, renderServerComponents, setError],
  );

  return (
    <form onSubmit={handleSubmit(handleUpdate)}>
      {/* Form error */}
      {errors?.serverError?.message && (
        <div className="mb-6 flex items-center justify-center rounded-sm border border-red p-4 text-sm text-red">
          <p>{errors.serverError.message}</p>
        </div>
      )}

      <div className="space-y-12">
        <div className="space-y-4">
          {/* First + last name */}
          <div className="flex w-full gap-3">
            <FormFieldText
              autoComplete="given-name"
              disabled={isSubmitting || isSubmitSuccessful}
              error={errors.firstName?.message}
              label="First name"
              {...register('firstName')}
            />

            <FormFieldText
              autoComplete="family-name"
              disabled={isSubmitting || isSubmitSuccessful}
              error={errors.lastName?.message}
              label="Last name"
              {...register('lastName')}
            />
          </div>

          {/* Phone */}
          <FormFieldText
            autoComplete="tel"
            disabled={isSubmitting || isSubmitSuccessful}
            error={errors.phone?.message}
            label="Phone"
            type="tel"
            {...register('phone')}
          />

          {/* Email */}
          <FormFieldText
            autoComplete="email"
            disabled={isSubmitting || isSubmitSuccessful}
            error={errors.email?.message}
            label="Email address"
            type="text"
            {...register('email')}
          />
        </div>

        <div className="space-y-4">
          {/* Current password */}
          <FormFieldText
            autoComplete="current-password"
            disabled={isSubmitting || isSubmitSuccessful}
            error={errors.currentPassword?.message}
            label="Current password"
            type="password"
            {...register('currentPassword')}
          />

          {/* New password */}
          <FormFieldText
            disabled={isSubmitting || isSubmitSuccessful}
            error={errors.newPassword?.message}
            label="New password"
            type="password"
            {...register('newPassword')}
          />

          {/* New password (repeat) */}
          <FormFieldText
            disabled={isSubmitting || isSubmitSuccessful}
            error={errors.newPasswordRepeat?.message}
            label="Re-enter new password"
            type="password"
            {...register('newPasswordRepeat')}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10 flex justify-end">
        <div className="flex gap-2">
          <Button
            disabled={isSubmitting || isSubmitSuccessful}
            mode="outline"
            onClick={onClose}
            type="button"
          >
            Cancel
          </Button>
          <Button
            disabled={!isDirty || isSubmitting || isSubmitSuccessful}
            type="submit"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </form>
  );
}

export async function callAccountUpdateApi({
  email,
  phone,
  firstName,
  lastName,
  currentPassword,
  newPassword,
}: FormValues) {
  try {
    const res = await fetch(`/api/account`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentPassword,
        email,
        firstName,
        lastName,
        newPassword,
        phone,
      }),
    });
    if (res.ok) {
      return {};
    } else {
      return res.json();
    }
  } catch (_e) {
    return {
      error: 'Error saving account. Please try again.',
    };
  }
}
