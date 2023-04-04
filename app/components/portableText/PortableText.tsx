import {
  PortableText as PortableTextReact,
  PortableTextComponents,
} from '@portabletext/react';
import {PortableTextBlock} from '@sanity/types';
import clsx from 'clsx';

import type {SanityColorTheme} from '~/types/sanity';

import LinkEmailAnnotation from './annotations/LinkEmail';
import LinkExternalAnnotation from './annotations/LinkExternal';
import LinkInternalAnnotation from './annotations/LinkInternal';
import AccordionBlock from './blocks/Accordion';
import Block from './blocks/Block';
import CalloutBlock from './blocks/Callout';
import GridBlock from './blocks/Grid';
import ImagesBlock from './blocks/Images';
import InstagramBlock from './blocks/Instagram';
import ListBlock from './blocks/List';
import ProductsBlock from './blocks/Products';

type Props = {
  blocks: PortableTextBlock[];
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
  const components: PortableTextComponents = {
    list: ListBlock,
    marks: {
      annotationLinkExternal: LinkExternalAnnotation,
      annotationLinkInternal: LinkInternalAnnotation,
      annotationLinkEmail: LinkEmailAnnotation,
      // TODO - add product annotation (replace server component)
      // annotationProduct: (props: any) => (
      //   <ProductAnnotation colorTheme={colorTheme} {...props} />
      // ),
    },
    block: Block,
    types: {
      blockAccordion: AccordionBlock,
      blockCallout: (props: any) => (
        <CalloutBlock centered={centered} colorTheme={colorTheme} {...props} />
      ),
      blockGrid: GridBlock,
      blockImages: (props: any) => (
        <ImagesBlock centered={centered} {...props} />
      ),
      blockInstagram: InstagramBlock,
      blockProducts: ProductsBlock,
    },
  };

  return (
    <div className={clsx('portableText', className)}>
      <PortableTextReact value={blocks} components={components} />
    </div>
  );
}
