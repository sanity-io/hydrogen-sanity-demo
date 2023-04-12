import type {PortableTextMarkComponentProps} from '@portabletext/react';
import clsx from 'clsx';

type Props = PortableTextMarkComponentProps & {
  value?: PortableTextMarkComponentProps['value'] & {
    email: string;
  };
};

const LinkEmailAnnotation = ({children, value}: Props) => {
  if (!value?.email) {
    return null;
  }

  return (
    <a
      className={clsx(
        'underline transition-opacity duration-200', //
        'hover:opacity-60',
      )}
      href={`mailto:${value?.email}`}
    >
      <>{children}</>
    </a>
  );
};

export default LinkEmailAnnotation;
