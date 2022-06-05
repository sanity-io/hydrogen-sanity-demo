import type {PortableTextBlock} from '@portabletext/types';
import {ReactNode} from 'react';

type Props = {
  children?: ReactNode;
  node: PortableTextBlock;
};

const Block = ({children, node}: Props) => {
  if (node.style === 'h2') {
    return <h2 className="my-4 border border-blue-400 text-2xl">{children}</h2>;
  }

  // Paragraphs
  return (
    <p className="relative my-4 border border-lime-400 leading-paragraph">
      {children}
    </p>
  );
};

export default Block;
