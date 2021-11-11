import {LinkIcon} from '@heroicons/react/outline';
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
      <span>
        <LinkIcon className="h-4 ml-0.5 w-4" />
      </span>
    </Link>
  );
};

export default AnnotationLinkInternal;
