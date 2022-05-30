const AnnotationLinkExternal = (props) => {
  const {children, mark} = props;

  return (
    <a
      className="inline-flex items-center text-black underline transition-opacity duration-300 hover:opacity-60"
      href={mark?.url}
      rel="noopener noreferrer"
      target={mark?.newWindow ? '_blank' : '_self'}
    >
      {children}
    </a>
  );
};

export default AnnotationLinkExternal;
