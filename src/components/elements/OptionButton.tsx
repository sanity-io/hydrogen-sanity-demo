import clsx from 'clsx';

type Props = {
  checked?: boolean;
  label: string;
};

export default function OptionButton({checked, label}: Props) {
  return (
    <div
      className={clsx([
        'cursor-pointer rounded-[6px] border px-3 py-2 text-sm leading-none text-darkGray',
        checked ? 'border-black text-black' : 'border-lightGray',
      ])}
    >
      {label}
    </div>
  );
}
