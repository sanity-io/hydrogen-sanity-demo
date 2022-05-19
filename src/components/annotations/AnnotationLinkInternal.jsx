import {Link} from '@shopify/hydrogen/client';

const AnnotationLinkInternal = (props) => {
  const {children, mark} = props;

  if (!mark?.slug) {
    return null;
  }

  return (
    <Link
      className="duration-300 inline-flex font-medium hover:opacity-60 items-center text-black transition-opacity underline"
      to={mark?.slug}
    >
      {children}
      {/* TODO: remove */}
      <span>(link icon)</span>
    </Link>
  );
};

export default AnnotationLinkInternal;
