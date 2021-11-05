const AnnotationLinkExternal = (props) => {
  const {children, mark} = props;

  return (
    <a
      className="underline"
      href={mark?.url}
      rel="noopener noreferrer"
      target={mark?.newWindow ? '_blank' : '_self'}
    >
      {children}
    </a>
  );
};

export default AnnotationLinkExternal;
