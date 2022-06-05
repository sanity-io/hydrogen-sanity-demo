import BlockContent from '@sanity/block-content-to-react';
import {SanityColorTheme} from '../types';
import AnnotationLinkEmail from './annotations/AnnotationLinkEmail';
import AnnotationLinkExternal from './annotations/AnnotationLinkExternal';
import AnnotationLinkInternal from './annotations/AnnotationLinkInternal';
import AnnotationProduct from './annotations/AnnotationProduct.client';
import Block from './blocks/Block.server';
import BlockCallout from './blocks/BlockCallout.server';
import BlockImages from './blocks/BlockImages.server';
import BlockProducts from './blocks/BlockProducts.server';
// import BlockInlineProduct from './blocks/BlockInlineProduct.client';
// import BlockInlineProductMarginalia from './blocks/BlockInlineProductMarginalia.client';
// import BlockProduct from './blocks/BlockProduct.client';

type Props = {
  colorTheme?: SanityColorTheme;
};

const portableTextMarks = {
  annotationLinkEmail: AnnotationLinkEmail,
  annotationLinkExternal: AnnotationLinkExternal,
  annotationLinkInternal: AnnotationLinkInternal,
  annotationProduct: AnnotationProduct,
  strong: (props) => {
    return <strong>{props.children}</strong>;
  },
};

const PortableText = ({blocks, className, colorTheme}: Props) => {
  return (
    <div className={className}>
      <BlockContent
        blocks={blocks}
        className="max-w-[650px] px-8"
        renderContainerOnSingleChild
        serializers={{
          // Marks
          marks: portableTextMarks,
          // Block types
          types: {
            block: Block,
            blockCallout: (props) => (
              <BlockCallout colorTheme={colorTheme} {...props} />
            ),
            blockImages: BlockImages,
            blockProducts: BlockProducts,
            /*
            blockInlineProduct: BlockInlineProduct,
            blockInlineProductMarginalia: BlockInlineProductMarginalia,
            */
          },
        }}
      />
    </div>
  );
};

export default PortableText;
