import {yupResolver} from '@hookform/resolvers/yup';
import {Link, useNavigate} from '@shopify/hydrogen/client';
import {useCallback} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import * as yup from 'yup';
import Button from '../../elements/Button';
import FormCardWrapper from '../FormCardWrapper.client';
import FormFieldText from '../FormFieldText.client';
import {callLoginApi} from './Login.client';

type FormValues = {
  email: string;
  password: string;
  passwordRepeat: string;
};

const schema = yup
  .object({
    email: yup.string().email('Please enter a valid email'),
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

export default function RegisterForm() {
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
      email: '',
      password: '',
    },
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  const handleRegister: SubmitHandler<FormValues> = useCallback(
    async (formData) => {
      const response = await callAccountCreateApi({
        email: formData.email,
        password: formData.password,
      });

      if (response.error) {
        setError('serverError', {
          message: response.error,
          type: 'custom',
        });
        return;
      }

      // this can be avoided if customerCreate mutation returns customerAccessToken
      await callLoginApi({
        email: formData.email,
        password: formData.password,
      });

      navigate('/account');
    },
    [navigate, setError],
  );

  return (
    <div className="my-24 flex justify-center px-4">
      <FormCardWrapper title="Create an account">
        <form onSubmit={handleSubmit(handleRegister)}>
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
              {isSubmitting || isSubmitSuccessful
                ? 'Creating...'
                : 'Create account'}
            </Button>
            <div className="flex justify-between">
              <p className="text-sm">
                Already have an account? &nbsp;
                <Link className="inline underline" to="/account">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </form>
      </FormCardWrapper>
    </div>
  );
}

export async function callAccountCreateApi({
  email,
  password,
  firstName,
  lastName,
}: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}) {
  try {
    const res = await fetch(`/account/register`, {
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
