import type {
  PortableTextBlock,
  PortableTextMarkDefinition,
} from '@portabletext/types';
import clsx from 'clsx';

type Props = PortableTextBlock & {
  mark: PortableTextMarkDefinition & {
    email: string;
  };
};

const AnnotationLinkEmail = (props: Props) => {
  const {children, mark} = props;
  return (
    <a
      className={clsx(
        'underline transition-opacity duration-200', //
        'hover:opacity-60',
      )}
      href={`mailto:${mark?.email}`}
    >
      <>{children}</>
    </a>
  );
};

export default AnnotationLinkEmail;
