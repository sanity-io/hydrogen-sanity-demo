import clsx from 'clsx';

type Props = {
  label: string;
  tone?: 'dark' | 'light';
};

export default function Tooltip({label, tone = 'light'}: Props) {
  return (
    <div
      className={clsx(
        'relative flex place-content-center rounded-sm px-2 py-1.5 text-xs leading-none',
        tone === 'light'
          ? 'bg-lightGray text-darkGray'
          : 'bg-offBlack text-white',
      )}
    >
      <svg
        className="absolute left-1/2 top-full -translate-x-1/2"
        width="10"
        height="4"
        viewBox="0 0 10 5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className={clsx(
            tone === 'light' ? 'fill-lightGray' : 'fill-offBlack',
          )}
          d="M5.62854 4.71897L10 0H0L4.37146 4.71897C4.7186 5.09368 5.2814 5.09368 5.62854 4.71897Z"
        />
      </svg>

      {label}
    </div>
  );
}
