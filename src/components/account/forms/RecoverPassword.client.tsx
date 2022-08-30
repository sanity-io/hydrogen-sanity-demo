import {yupResolver} from '@hookform/resolvers/yup';
import {useCallback} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import * as yup from 'yup';
import Button from '../../elements/Button';
import FormCardWrapper from '../FormCardWrapper.client';
import FormFieldText from '../FormFieldText.client';

type FormValues = {
  email: string;
};

const schema = yup
  .object({
    email: yup.string().email('Please enter a valid email'),
  })
  .required();

export default function RecoverPasswordForm() {
  const {
    formState: {errors, isDirty, isSubmitting, isSubmitSuccessful},
    handleSubmit,
    register,
    setError,
  } = useForm<FormValues & {serverError?: string}>({
    defaultValues: {
      email: '',
    },
    resolver: yupResolver(schema),
  });

  const handleRecover: SubmitHandler<FormValues> = useCallback(
    async (formData) => {
      const response = await callAccountRecoverApi(formData);
      if (response.error) {
        setError('serverError', {
          message: response.error,
          type: 'custom',
        });
        return;
      }
    },
    [setError],
  );

  return (
    <div className="flex justify-center">
      <FormCardWrapper title="Recover password">
        {isSubmitSuccessful ? (
          <>
            <div className="text-sm">
              <p>
                If that email address is in our system, you&rsquo;ll receive an
                email with instructions on how to reset your password in a few
                minutes.
              </p>
            </div>
            {/* Footer */}
            <div className="mt-4 flex justify-center">
              <Button to="/account/login" type="button">
                Back to sign in
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="my-4 text-sm">
              Enter your email address to receive a password reset link.
            </p>
            <form onSubmit={handleSubmit(handleRecover)}>
              {/* Form error */}
              {errors?.serverError?.message && (
                <div className="mb-6 flex items-center justify-center rounded-sm border border-red p-4 text-sm text-red">
                  <p>{errors.serverError.message}</p>
                </div>
              )}

              <div className="space-y-12">
                <div className="space-y-4">
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
              </div>

              {/* Footer */}
              <div className="mt-4 flex justify-between">
                <Button
                  disabled={isSubmitting || isSubmitSuccessful}
                  mode="outline"
                  to="/account/login"
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  disabled={!isDirty || isSubmitting || isSubmitSuccessful}
                  type="submit"
                >
                  {isSubmitting ? 'Processing...' : 'Send reset link'}
                </Button>
              </div>
            </form>
          </>
        )}
      </FormCardWrapper>
    </div>
  );
}

export async function callAccountRecoverApi({
  email,
  password,
  firstName,
  lastName,
}: {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}) {
  try {
    const res = await fetch(`/api/account/recover`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email, password, firstName, lastName}),
    });
    if (res.status === 200) {
      return {};
    } else {
      return res.json();
    }
  } catch (error) {
    return {
      error:
        (error instanceof Error)?.toString() || 'An unknown error has occurred',
    };
  }
}
