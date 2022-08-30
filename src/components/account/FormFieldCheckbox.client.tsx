import clsx from 'clsx';
import {forwardRef} from 'react';
import {UseFormRegister} from 'react-hook-form';

type Props = {
  description?: string;
  disabled?: boolean;
  error?: string;
  label: string;
} & ReturnType<UseFormRegister<any>>;

const FormFieldCheckbox = forwardRef<HTMLInputElement, Props>(
  ({description, disabled, error, label, name, onBlur, onChange}, ref) => {
    return (
      <div className="flex items-center space-x-2">
        <input
          aria-label={label}
          className={clsx([
            'disabled:bg-gray/50 disabled:opacity-50',
            error ? 'border-red' : 'border-darkGray/50',
          ])}
          disabled={disabled}
          id={name}
          name={name}
          onBlur={onBlur}
          onChange={onChange}
          ref={ref}
          type="checkbox"
        />

        <div>
          {/* Label */}
          {label && (
            <label
              className="text-sm leading-none text-darkGray"
              htmlFor={name}
            >
              {label}
            </label>
          )}
          {/* Description */}
          {description && (
            <div className="text-sm text-darkGray/75">{description}</div>
          )}
        </div>

        {/* Field error */}
        {error && <div className="text-sm text-red">{error}</div>}
      </div>
    );
  },
);

export default FormFieldCheckbox;
