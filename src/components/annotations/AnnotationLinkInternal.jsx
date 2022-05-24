import {Link} from '@shopify/hydrogen';

const AnnotationLinkInternal = (props) => {
  const {children, mark} = props;

  if (!mark?.slug) {
    return null;
  }

  return (
    <Link
      className="inline-flex items-center font-medium text-black underline transition-opacity duration-300 hover:opacity-60"
      to={mark?.slug}
    >
      {children}
      {/* TODO: remove */}
      <span>(link icon)</span>
    </Link>
  );
};

export default AnnotationLinkInternal;
