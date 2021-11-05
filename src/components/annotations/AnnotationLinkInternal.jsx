import {Link} from '@shopify/hydrogen/client';

const AnnotationLinkInternal = (props) => {
  const {children, mark} = props;

  if (!mark?.slug) {
    return null;
  }

  return (
    <Link className="underline" to={mark?.slug}>
      {children}
    </Link>
  );
};

export default AnnotationLinkInternal;
