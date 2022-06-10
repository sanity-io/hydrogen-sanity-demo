import clsx from 'clsx';
import {HTMLAttributes} from 'react';

type Props = HTMLAttributes<HTMLButtonElement>;

export default function CircleOutlineButton(props: Props) {
  const {className, ...rest} = props;

  return (
    <button
      className={clsx(
        'aspect-square w-[2.375rem] place-content-center rounded-full border border-offBlack fill-offBlack text-sm font-bold duration-200',
        'hover:border-opacity-50',
        className,
      )}
      type="button"
      {...rest}
    />
  );
}
