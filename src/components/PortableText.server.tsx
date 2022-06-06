import BlockContent from '@sanity/block-content-to-react';
import {SanityColorTheme} from '../types';
import AnnotationLinkEmail from './annotations/AnnotationLinkEmail';
import AnnotationLinkExternal from './annotations/AnnotationLinkExternal';
import AnnotationLinkInternal from './annotations/AnnotationLinkInternal';
import AnnotationProduct from './annotations/AnnotationProduct.server';
import Block from './blocks/Block.server';
import BlockCallout from './blocks/BlockCallout.server';
import BlockImages from './blocks/BlockImages.server';
import BlockProducts from './blocks/BlockProducts.server';
import BlockList from './blocks/BlockList.server';
// import BlockInlineProductMarginalia from './blocks/BlockInlineProductMarginalia.client';

type Props = {
  className?: string;
  colorTheme?: SanityColorTheme;
};

const PortableText = ({blocks, className, colorTheme}: Props) => {
  return (
    <BlockContent
      blocks={blocks}
      className={className}
      renderContainerOnSingleChild
      serializers={{
        // Lists
        list: BlockList,
        // Marks
        marks: {
          annotationLinkEmail: AnnotationLinkEmail,
          annotationLinkExternal: AnnotationLinkExternal,
          annotationLinkInternal: AnnotationLinkInternal,
          annotationProduct: (props) => (
            <AnnotationProduct colorTheme={colorTheme} {...props} />
          ),
        },
        // Block types
        types: {
          block: Block,
          blockCallout: (props) => (
            <BlockCallout colorTheme={colorTheme} {...props} />
          ),
          blockImages: BlockImages,
          blockProducts: BlockProducts,
          /*
          blockInlineProductMarginalia: BlockInlineProductMarginalia,
          */
        },
      }}
    />
  );
};

export default PortableText;
