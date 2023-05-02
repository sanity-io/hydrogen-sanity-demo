import {SVGAttributes} from 'react';

export function ChevronDownIcon(props: SVGAttributes<SVGElement>) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9.75 4.5L6 8.25L2.25 4.5"
        stroke="#3A3E3E"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
