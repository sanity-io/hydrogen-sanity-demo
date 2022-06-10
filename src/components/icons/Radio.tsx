export default function RadioIcon({
  checked,
  hovered,
}: {
  checked?: boolean;
  hovered?: boolean;
}) {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {checked ? (
        <>
          <path
            d="M0 10.5C0 4.70101 4.70101 0 10.5 0C16.299 0 21 4.70101 21 10.5C21 16.299 16.299 21 10.5 21C4.70101 21 0 16.299 0 10.5Z"
            fill="#1147E0"
          />
          <path
            d="M15.6562 7.21875L9.09375 13.7812L5.8125 10.5"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <>
          <path
            d="M10.5 20.5C4.97715 20.5 0.5 16.0228 0.5 10.5C0.5 4.97715 4.97715 0.5 10.5 0.5C16.0228 0.5 20.5 4.97715 20.5 10.5C20.5 16.0228 16.0228 20.5 10.5 20.5Z"
            fill="white"
          />
          <path
            className={hovered ? 'opacity-100' : 'opacity-0'}
            d="M15.6562 7.21875L9.09375 13.7812L5.8125 10.5"
            stroke="#E7E7E7"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.5 20.5C4.97715 20.5 0.5 16.0228 0.5 10.5C0.5 4.97715 4.97715 0.5 10.5 0.5C16.0228 0.5 20.5 4.97715 20.5 10.5C20.5 16.0228 16.0228 20.5 10.5 20.5Z"
            stroke="#E7E7E7"
          />
        </>
      )}
    </svg>
  );
}
