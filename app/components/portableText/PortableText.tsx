import {
  PortableText as PortableTextReact,
  PortableTextComponents,
} from '@portabletext/react';
import {PortableTextBlock} from '@sanity/types';
import clsx from 'clsx';
import {useMemo} from 'react';

import type {SanityColorTheme} from '~/types/sanity';

import LinkEmailAnnotation from './annotations/LinkEmail';
import LinkExternalAnnotation from './annotations/LinkExternal';
import LinkInternalAnnotation from './annotations/LinkInternal';
import ProductAnnotation from './annotations/Product';
import AccordionBlock from './blocks/Accordion';
import Block from './blocks/Block';
import CalloutBlock from './blocks/Callout';
import GridBlock from './blocks/Grid';
import ImagesBlock from './blocks/Images';
import InstagramBlock from './blocks/Instagram';
import ProductsBlock from './blocks/Products';

const SHARED_LIST_CLASSES = clsx(
  'first:mt-0 last:mb-0', //
  'my-8 space-y-0.5 leading-paragraph list-outside ml-8',
);

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
    list: {
      bullet: ({children}) => (
        <ul className={SHARED_LIST_CLASSES}>{children}</ul>
      ),
      number: ({children}) => (
        <ol className={SHARED_LIST_CLASSES}>{children}</ol>
      ),
    },
    marks: {
      annotationLinkExternal: LinkExternalAnnotation,
      annotationLinkInternal: LinkInternalAnnotation,
      annotationLinkEmail: LinkEmailAnnotation,
      annotationProduct: (props: any) => (
        <ProductAnnotation colorTheme={colorTheme} {...props} />
      ),
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

  const portableText = useMemo(() => {
    return (
      <div className={clsx('portableText', className)}>
        <PortableTextReact value={blocks} components={components} />
      </div>
    );
  }, [blocks]);

  return portableText;
}
