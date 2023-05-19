import type {PortableTextMarkComponentProps} from '@portabletext/react';
import clsx from 'clsx';

type Props = PortableTextMarkComponentProps & {
  value?: PortableTextMarkComponentProps['value'] & {
    newWindow?: boolean;
    url: string;
  };
};

const LinkExternalAnnotation = ({children, value}: Props) => {
  if (!value?.url) {
    return <>{children}</>;
  }

  return (
    <a
      className={clsx(
        'inline-flex items-center underline transition-opacity duration-200',
        'hover:opacity-60',
      )}
      href={value?.url}
      rel="noopener noreferrer"
      target={value?.newWindow ? '_blank' : '_self'}
    >
      <>{children}</>
    </a>
  );
};

export default LinkExternalAnnotation;
