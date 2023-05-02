import {SVGAttributes} from 'react';

export function ArrowRightIcon(props: SVGAttributes<SVGElement>) {
  return (
    <svg fill="none" height="24" viewBox="0 0 24 24" width="24" {...props}>
      <path
        className="fill-offBlack"
        clipRule="evenodd"
        d="M3 12C3 11.5858 3.33579 11.25 3.75 11.25L20.25 11.25C20.6642 11.25 21 11.5858 21 12C21 12.4142 20.6642 12.75 20.25 12.75L3.75 12.75C3.33579 12.75 3 12.4142 3 12Z"
        fillRule="evenodd"
      />
      <path
        className="fill-offBlack"
        clipRule="evenodd"
        d="M12.9697 4.71967C13.2626 4.42678 13.7374 4.42678 14.0303 4.71967L20.7803 11.4697C21.0732 11.7626 21.0732 12.2374 20.7803 12.5303L14.0303 19.2803C13.7374 19.5732 13.2626 19.5732 12.9697 19.2803C12.6768 18.9874 12.6768 18.5126 12.9697 18.2197L19.1893 12L12.9697 5.78033C12.6768 5.48744 12.6768 5.01256 12.9697 4.71967Z"
        fillRule="evenodd"
      />
    </svg>
  );
}
