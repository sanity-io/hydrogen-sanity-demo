import {SVGAttributes} from 'react';

export default function CreditCardIcon(props: SVGAttributes<SVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 4C1 3.44772 1.44772 3 2 3H14C14.5523 3 15 3.44772 15 4V12C15 12.5523 14.5523 13 14 13H2C1.44772 13 1 12.5523 1 12V4ZM14 4H2V12H14V4Z"
        fill="black"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 10.5C10 10.2239 10.2239 10 10.5 10H12.5C12.7761 10 13 10.2239 13 10.5C13 10.7761 12.7761 11 12.5 11H10.5C10.2239 11 10 10.7761 10 10.5Z"
        fill="black"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 10.5C7 10.2239 7.22386 10 7.5 10H8.5C8.77614 10 9 10.2239 9 10.5C9 10.7761 8.77614 11 8.5 11H7.5C7.22386 11 7 10.7761 7 10.5Z"
        fill="black"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 6.05664C1 5.7805 1.22386 5.55664 1.5 5.55664H14.5C14.7761 5.55664 15 5.7805 15 6.05664C15 6.33278 14.7761 6.55664 14.5 6.55664H1.5C1.22386 6.55664 1 6.33278 1 6.05664Z"
        fill="black"
      />
    </svg>
  );
}
