import clsx from 'clsx';

type Props = {
  label: string;
  mode?: 'default' | 'outline';
  small?: boolean;
  tone?: 'default' | 'critical';
};

export default function Badge({
  label,
  mode = 'default',
  small,
  tone = 'default',
}: Props) {
  return (
    <div
      className={clsx(
        'flex place-content-center rounded-sm bg-white px-1.5 py-1 leading-none',
        small ? 'text-xs' : 'text-sm',
        mode === 'outline' && 'border',
        tone === 'critical' && 'border-red text-red',
        tone === 'default' && 'border-darkGray text-darkGray',
      )}
    >
      {label}
    </div>
  );
}
