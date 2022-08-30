import {yupResolver} from '@hookform/resolvers/yup';
import {useNavigate} from '@shopify/hydrogen/client';
import {useCallback} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import * as yup from 'yup';
import Button from '../../elements/Button';
import FormCardWrapper from '../FormCardWrapper.client';
import FormFieldText from '../FormFieldText.client';

type FormValues = {
  password: string;
  passwordRepeat: string;
};

type Props = {
  id: string;
  resetToken: string;
};

const schema = yup
  .object({
    password: yup
      .string()
      .required('Please enter a password')
      .min(5, 'Passwords must have at least 5 characters'),
    passwordRepeat: yup.string().when('password', {
      is: (field: string) => field.length > 0,
      then: yup.string().oneOf([yup.ref('password')], 'Passwords must match'),
    }),
  })
  .required();

export default function ResetPasswordForm({id, resetToken}: Props) {
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
    defaultValues: {
      password: '',
      passwordRepeat: '',
    },
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  const handleReset: SubmitHandler<FormValues> = useCallback(
    async (formData) => {
      const response = await callPasswordResetApi({
        id,
        password: formData.password,
        resetToken,
      });

      if (response.error) {
        setError('serverError', {
          message: response.error,
          type: 'custom',
        });
        return;
      }

      navigate('/account');
    },
    [id, navigate, resetToken, setError],
  );

  return (
    <div className="my-24 flex justify-center px-4">
      <FormCardWrapper title="Reset password">
        <p className="my-4 text-sm">Enter a new password for your account.</p>
        <form onSubmit={handleSubmit(handleReset)}>
          {/* Form error */}
          {errors?.serverError?.message && (
            <div className="mb-6 flex items-center justify-center rounded-sm border border-red p-4 text-sm text-red">
              <p>{errors.serverError.message}</p>
            </div>
          )}

          <div className="space-y-12">
            <div className="space-y-4">
              {/* Password */}
              <FormFieldText
                disabled={isSubmitting || isSubmitSuccessful}
                error={errors.password?.message}
                label="Password"
                type="password"
                {...register('password')}
              />

              {/* Password (repeat) */}
              <FormFieldText
                disabled={isSubmitting || isSubmitSuccessful}
                error={errors.passwordRepeat?.message}
                label="Repeat password"
                type="password"
                {...register('passwordRepeat')}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 space-y-4">
            <Button
              disabled={!isDirty || isSubmitting || isSubmitSuccessful}
              type="submit"
            >
              {isSubmitting || isSubmitSuccessful ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </FormCardWrapper>
    </div>
  );
}

export async function callPasswordResetApi({
  id,
  resetToken,
  password,
}: {
  id: string;
  resetToken: string;
  password: string;
}) {
  try {
    const res = await fetch(`/api/account/reset`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id, resetToken, password}),
    });

    if (res.ok) {
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
