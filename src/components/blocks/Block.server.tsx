import type {PortableTextBlock} from '@portabletext/types';
import clsx from 'clsx';
import {Children, ReactNode} from 'react';

type Props = {
  children?: ReactNode;
  node: PortableTextBlock;
};

const Block = ({children, node}: Props) => {
  if (node.style === 'h2') {
    return (
      <h2
        className={clsx(
          'first:mt-0', //
          'mt-16 mb-4 text-xl font-bold',
        )}
      >
        {children}
      </h2>
    );
  }

  // Don't render empty paragraphs
  if (Children.count(children) === 1 && Children.toArray(children)[0] === '') {
    return null;
  }

  // Non-empty paragraphs
  return (
    <p
      className={clsx(
        'first:mt-0', //
        'relative my-4 leading-paragraph',
      )}
    >
      {children}
    </p>
  );
};

export default Block;
