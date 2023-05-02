import {SVGAttributes} from 'react';

export function UserIcon(props: SVGAttributes<SVGElement>) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4 10.5C3 11 1.5 12 1.5 15.5H15.5C15.5 12 14.3416 11.1708 13 10.5C12 10 10 10 10 8.5C10 7 11 6.25 11 4.25C11 2.25 10 1.25 8.5 1.25C7 1.25 6 2.25 6 4.25C6 6.25 7 7 7 8.5C7 10 5 10 4 10.5Z"
        stroke="#101112"
        strokeWidth="1.2"
      />
    </svg>
  );
}
