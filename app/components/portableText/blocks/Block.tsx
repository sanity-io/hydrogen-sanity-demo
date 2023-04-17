import {PortableTextBlock} from '@portabletext/types';
import clsx from 'clsx';
import {ReactNode} from 'react';

type Props = {
  children?: ReactNode;
  value: PortableTextBlock;
};

export default function Block({children, value}: Props) {
  if (value.style === 'h2') {
    return (
      <h2
        className={clsx(
          'first:mt-0 last:mb-0', //
          'mt-16 mb-4 text-xl font-bold',
        )}
      >
        {children}
      </h2>
    );
  }

  // Pragraphs
  return (
    <div
      className={clsx(
        'first:mt-0 last:mb-0', //
        'relative my-4 leading-paragraph',
      )}
    >
      {children}
    </div>
  );
}
