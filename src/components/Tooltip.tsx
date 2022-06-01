import clsx from 'clsx';

export default function Tooltip({label}: {label: string}) {
  return (
    <div
      className={clsx([
        'relative flex place-content-center rounded-sm bg-lightGray px-1.5 py-1 text-xs leading-none text-darkGray',
      ])}
    >
      <svg
        className="absolute top-full left-1/2 -translate-x-1/2"
        width="10"
        height="5"
        viewBox="0 0 10 5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="fill-lightGray"
          d="M5.62854 4.71897L10 0H0L4.37146 4.71897C4.7186 5.09368 5.2814 5.09368 5.62854 4.71897Z"
        />
      </svg>

      {label}
    </div>
  );
}
