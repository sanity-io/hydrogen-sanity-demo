import clsx from 'clsx';
import type {InputHTMLAttributes} from 'react';

import countries from '~/data/allCountries.json';

type Props = {
  description?: string;
  error?: string;
  label: string;
  ref?: React.Ref<HTMLSelectElement>;
} & InputHTMLAttributes<HTMLSelectElement>;

const FormFieldCountries = (props: Props) => {
  const {description, error, label, ...rest} = props;

  return (
    <div className="space-y-1">
      {/* Label */}
      {label && (
        <label className="text-sm text-darkGray" htmlFor={props.name}>
          {label}
        </label>
      )}
      {/* Description */}
      {description && (
        <div className="text-sm text-darkGray/75">{description}</div>
      )}
      <select
        aria-label={label}
        className={clsx([
          'w-full appearance-none rounded-xs border px-3 py-2 text-sm leading-field',
          'bg-[url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOSIgaGVpZ2h0PSIxNSIgdmlld0JveD0iMCAwIDkgMTUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik04LjUgMTAuNUw0Ljc1IDE0LjI1TDEgMTAuNSIgc3Ryb2tlPSIjM0EzRTNFIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTEgNC43NUw0Ljc1IDFMOC41IDQuNzUiIHN0cm9rZT0iIzNBM0UzRSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=)] bg-[right_0.75rem_center] bg-no-repeat',
          'disabled:bg-gray/50 disabled:opacity-50',
          'focus:outline-1',
          error ? 'border-red' : 'border-darkGray/50',
        ])}
        {...rest}
      >
        <option className="text-red" disabled value="">
          {label}
        </option>
        {countries?.map((country) => (
          <option key={country.description} value={country.description}>
            {country.description}
          </option>
        ))}
      </select>
      {/* Field error */}
      {error && <div className="text-sm text-red">{error}</div>}
    </div>
  );
};

export default FormFieldCountries;
