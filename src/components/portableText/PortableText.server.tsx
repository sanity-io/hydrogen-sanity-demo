import BlockContent from '@sanity/block-content-to-react';
import type {Block as SanityBlock} from '@sanity/types';
import type {SanityColorTheme} from '../../types';
import AnnotationLinkEmail from './annotations/AnnotationLinkEmail';
import AnnotationLinkExternal from './annotations/AnnotationLinkExternal';
import AnnotationLinkInternal from './annotations/AnnotationLinkInternal';
import AnnotationProduct from './annotations/AnnotationProduct.server';
import Block from './blocks/Block';
import BlockAccordion from './blocks/BlockAccordion.client';
import BlockCallout from './blocks/BlockCallout.server';
import BlockGrid from './blocks/BlockGrid.server';
import BlockImages from './blocks/BlockImages.server';
import BlockList from './blocks/BlockList';
import BlockProducts from './blocks/BlockProducts.server';

type Props = {
  blocks: SanityBlock[];
  className?: string;
  centered?: boolean;
  colorTheme?: SanityColorTheme;
};

export default function PortableText({
  blocks,
  centered,
  className,
  colorTheme,
}: Props) {
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
          blockAccordion: BlockAccordion,
          blockCallout: (props) => (
            <BlockCallout
              centered={centered}
              colorTheme={colorTheme}
              {...props}
            />
          ),
          blockGrid: BlockGrid,
          blockImages: (props) => (
            <BlockImages centered={centered} {...props} />
          ),
          blockProducts: BlockProducts,
        },
      }}
    />
  );
}
