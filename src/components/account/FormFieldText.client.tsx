import clsx from 'clsx';
import {forwardRef} from 'react';
import {UseFormRegister} from 'react-hook-form';

type Props = {
  autoComplete?: string;
  description?: string;
  disabled?: boolean;
  error?: string;
  label: string;
  placeholder?: string;
  type?: 'password' | 'tel' | 'text';
} & ReturnType<UseFormRegister<any>>;

const FormFieldText = forwardRef<HTMLInputElement, Props>(
  (
    {
      autoComplete,
      description,
      disabled,
      error,
      label,
      name,
      onBlur,
      onChange,
      placeholder,
      type = 'text',
    },
    ref,
  ) => {
    return (
      <div className="w-full space-y-1">
        {/* Label */}
        {label && (
          <label className="text-sm text-darkGray" htmlFor={name}>
            {label}
          </label>
        )}
        {/* Description */}
        {description && (
          <div className="text-sm text-darkGray/75">{description}</div>
        )}
        <input
          aria-label={label}
          autoComplete={autoComplete}
          className={clsx([
            'w-full appearance-none rounded-xs border py-2 px-3 text-sm leading-field',
            'disabled:bg-gray/50 disabled:opacity-50',
            'focus:outline-1',
            error ? 'border-red' : 'border-darkGray/50',
          ])}
          disabled={disabled}
          id={name}
          name={name}
          onBlur={onBlur}
          onChange={onChange}
          placeholder={placeholder}
          ref={ref}
          type={type}
        />
        {/* Field error */}
        {error && <div className="text-sm text-red">{error}</div>}
      </div>
    );
  },
);

export default FormFieldText;
