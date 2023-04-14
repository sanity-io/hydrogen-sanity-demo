import clsx from 'clsx';
import type {InputHTMLAttributes} from 'react';

type Props = {
  description?: string;
  error?: string;
  label: string;
  ref?: React.Ref<HTMLInputElement>;
} & InputHTMLAttributes<HTMLInputElement>;

const FormFieldCheckbox = (props: Props) => {
  const {description, error, label, ...rest} = props;

  return (
    <div className="flex items-center space-x-2">
      <input
        aria-label={label}
        className={clsx([
          'disabled:bg-gray/50 disabled:opacity-50',
          error ? 'border-red' : 'border-darkGray/50',
        ])}
        {...rest}
        type="checkbox"
      />

      <div>
        {/* Label */}
        {label && (
          <label
            className="text-sm leading-none text-darkGray"
            htmlFor={props.name}
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
};

export default FormFieldCheckbox;
