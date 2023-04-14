import {ReactNode} from 'react';

type Props = {
  children?: ReactNode;
  title: string;
};

export default function FormCardWrapper({children, title}: Props) {
  return (
    <div className="w-full max-w-md rounded-lg border border-gray p-6">
      <h1 className="mb-4 text-center text-xl font-bold">{title}</h1>
      {children}
    </div>
  );
}
