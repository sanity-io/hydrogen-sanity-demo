import {ReactNode} from 'react';

type Props = {
  children?: ReactNode;
  title?: string;
};

export default function FormField({children}: Props) {
  return <div className="border border-red">{children}</div>;
}
