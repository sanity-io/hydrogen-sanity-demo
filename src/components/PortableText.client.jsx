import BlockContent from '@sanity/block-content-to-react';
import AnnotationLinkEmail from './annotations/AnnotationLinkEmail';
import AnnotationLinkExternal from './annotations/AnnotationLinkExternal';
import AnnotationLinkInternal from './annotations/AnnotationLinkInternal';
import AnnotationProduct from './annotations/AnnotationProduct.client';
import Block from './blocks/Block.client';
import BlockImage from './blocks/BlockImage.client';
import BlockInlineProduct from './blocks/BlockInlineProduct.client';
import BlockInlineProductMarginalia from './blocks/BlockInlineProductMarginalia.client';
import BlockProduct from './blocks/BlockProduct.client';

const portableTextMarks = {
  annotationLinkEmail: AnnotationLinkEmail,
  annotationLinkExternal: AnnotationLinkExternal,
  annotationLinkInternal: AnnotationLinkInternal,
  annotationProduct: AnnotationProduct,
  h2: (props) => {
    return <span>yooo{props.children}</span>;
  },
  strong: (props) => {
    return <strong>{props.children}</strong>;
  },
};

const PortableText = (props) => {
  const {blocks, className} = props;

  return (
    <div className={className}>
      <BlockContent
        blocks={blocks}
        className="portableText"
        renderContainerOnSingleChild
        serializers={{
          // Marks
          marks: portableTextMarks,
          // Block types
          types: {
            block: Block,
            blockImage: BlockImage,
            blockProduct: BlockProduct,
            blockInlineProduct: BlockInlineProduct,
            blockInlineProductMarginalia: BlockInlineProductMarginalia,
          },
        }}
      />
    </div>
  );
};

export default PortableText;
