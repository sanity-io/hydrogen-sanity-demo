import {ReactNode} from 'react';

type Props = {
  children?: ReactNode;
  name: string;
  shopify?: boolean;
};

export default function DebugWrapper({children, name, shopify}: Props) {
  const background = shopify ? 'bg-teal-100' : 'bg-red-100';
  const borderColor = shopify ? 'border-teal-500' : 'border-red-500';
  const textColor = shopify ? 'text-teal-500' : 'text-red-500';

  return (
    <div
      className={`${background} bg-opacity-20 border border-dashed ${borderColor} m-2 p-2`}
    >
      {name && (
        <div
          className={`${background} bg-opacity-20 border ${borderColor} font-medium inline-block mb-2 px-3 py-2 rounded-sm text-xs ${textColor}`}
        >
          {name}
        </div>
      )}
      {children}
    </div>
  );
}
