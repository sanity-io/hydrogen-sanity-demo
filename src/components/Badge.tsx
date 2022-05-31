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
        'absolute flex place-content-center rounded-sm bg-white px-1.5 py-1 font-bold uppercase leading-none',
        small ? 'top-2 left-2 text-xs' : 'top-6 left-6 text-sm',
        tone === 'critical' && 'text-red',
        tone === 'default' && 'text-darkGray',
      )}
    >
      {label}
    </div>
  );
}
