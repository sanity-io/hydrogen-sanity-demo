import React from 'react';

const Block = (props) => {
  const {children, node} = props;

  if (node.style === 'h2') {
    return <h2 className="mb-4 text-2xl">{children}</h2>;
  }

  if (node.style === 'blockquote') {
    return (
      <blockquote className="relative my-8 text-3xl font-bold">
        {children}
      </blockquote>
    );
  }

  // HACK: render 'normal' blocks as <div> elements for now, since hydrogen injects screenreader <p> elements
  // (which shows console warnings when nested within other <p> elements)
  return <div className="relative mb-4">{children}</div>;
};

export default Block;
