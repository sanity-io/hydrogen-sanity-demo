import React from 'react';

const Block = (props) => {
  const {children, node} = props;

  if (node.style === 'h2') {
    return <h2 className="font-medium mb-4 text-2xl">{children}</h2>;
  }

  if (node.style === 'blockquote') {
    return (
      <blockquote className="font-semibold my-8 relative text-3xl">
        {children}
      </blockquote>
    );
  }

  // HACK: render 'normal' blocks as <div> elements for now, since hydrogen injects screenreader <p> elements
  // (which shows console warnings when nested within other <p> elements)
  return <div className="mb-4 relative">{children}</div>;
};

export default Block;
