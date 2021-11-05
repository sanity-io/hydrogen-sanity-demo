const AnnotationLinkEmail = (props) => {
  const {children, mark} = props;

  return (
    <a className="underline" href={`mailto:${mark?.email}`} variant="underline">
      {children}
    </a>
  );
};

export default AnnotationLinkEmail;
