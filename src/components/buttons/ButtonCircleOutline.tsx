import clsx from 'clsx';
import {HTMLAttributes} from 'react';

type Props = HTMLAttributes<HTMLButtonElement>;

export default function ButtonCircleOutline(props: Props) {
  const {className, ...rest} = props;

  return (
    <button
      className={clsx([
        'aspect-square w-[2.375rem] place-content-center rounded-full border border-offBlack fill-offBlack text-sm font-bold',
        className,
      ])}
      type="button"
      {...rest}
    />
  );
}
