const AnnotationLinkExternal = (props) => {
  const {children, mark} = props;

  return (
    <a
      className="duration-300 inline-flex font-medium hover:opacity-60 items-center text-black transition-opacity underline"
      href={mark?.url}
      rel="noopener noreferrer"
      target={mark?.newWindow ? '_blank' : '_self'}
    >
      {children}
    </a>
  );
};

export default AnnotationLinkExternal;
