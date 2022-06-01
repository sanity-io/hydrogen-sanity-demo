import clsx from 'clsx';

export default function Badge({
  label,
  small,
  tone = 'default',
}: {
  label: string;
  small?: boolean;
  tone?: 'default' | 'critical';
}) {
  return (
    <div
      className={clsx(
        'flex place-content-center rounded-sm bg-white px-1.5 py-1 font-bold uppercase leading-none',
        small ? 'text-xs' : 'text-sm',
        tone === 'critical' && 'text-red',
        tone === 'default' && 'text-darkGray',
      )}
    >
      {label}
    </div>
  );
}
