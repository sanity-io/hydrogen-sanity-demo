import BlockContent from '@sanity/block-content-to-react';
import type {Block as SanityBlock} from '@sanity/types';
import clsx from 'clsx';
import type {SanityColorTheme} from '../../types';
import LinkEmailAnnotation from './annotations/LinkEmail';
import LinkExternalAnnotation from './annotations/LinkExternal';
import LinkInternalAnnotation from './annotations/LinkInternal';
import ProductAnnotation from './annotations/Product.server';
import AccordionBlock from './blocks/Accordion.client';
import Block from './blocks/Block';
import CalloutBlock from './blocks/Callout.server';
import GridBlock from './blocks/Grid.server';
import ImagesBlock from './blocks/Images.server';
import InstagramBlock from './blocks/Instagram.server';
import ListBlock from './blocks/List';
import ProductsBlock from './blocks/Products.server';

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
      className={clsx('portableText', className)}
      renderContainerOnSingleChild
      serializers={{
        // Lists
        list: ListBlock,
        // Marks
        marks: {
          annotationLinkEmail: LinkEmailAnnotation,
          annotationLinkExternal: LinkExternalAnnotation,
          annotationLinkInternal: LinkInternalAnnotation,
          annotationProduct: (props: any) => (
            <ProductAnnotation colorTheme={colorTheme} {...props} />
          ),
        },
        // Block types
        types: {
          block: Block,
          blockAccordion: AccordionBlock,
          blockCallout: (props: any) => (
            <CalloutBlock
              centered={centered}
              colorTheme={colorTheme}
              {...props}
            />
          ),
          blockGrid: GridBlock,
          blockImages: (props: any) => (
            <ImagesBlock centered={centered} {...props} />
          ),
          blockInstagram: InstagramBlock,
          blockProducts: ProductsBlock,
        },
      }}
    />
  );
}
