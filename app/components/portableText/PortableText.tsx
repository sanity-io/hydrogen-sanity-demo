import {
  PortableText as PortableTextReact,
  PortableTextComponents,
} from '@portabletext/react';
import {PortableTextBlock} from '@sanity/types';
import clsx from 'clsx';
import {useMemo} from 'react';

import LinkEmailAnnotation from '~/components/portableText/annotations/LinkEmail';
import LinkExternalAnnotation from '~/components/portableText/annotations/LinkExternal';
import LinkInternalAnnotation from '~/components/portableText/annotations/LinkInternal';
import ProductAnnotation from '~/components/portableText/annotations/Product';
import AccordionBlock from '~/components/portableText/blocks/Accordion';
import Block from '~/components/portableText/blocks/Block';
import CalloutBlock from '~/components/portableText/blocks/Callout';
import GridBlock from '~/components/portableText/blocks/Grid';
import ImagesBlock from '~/components/portableText/blocks/Images';
import InstagramBlock from '~/components/portableText/blocks/Instagram';
import ProductsBlock from '~/components/portableText/blocks/Products';

const SHARED_LIST_CLASSES = clsx(
  'first:mt-0 last:mb-0', //
  'my-8 space-y-0.5 leading-paragraph list-outside ml-8',
);

type Props = {
  blocks: PortableTextBlock[];
  className?: string;
  centered?: boolean;
};

export default function PortableText({blocks, centered, className}: Props) {
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
      annotationProduct: (props: any) => <ProductAnnotation {...props} />,
    },
    block: Block,
    types: {
      'module.accordion': AccordionBlock,
      'module.callout': (props: any) => (
        <CalloutBlock centered={centered} {...props} />
      ),
      'module.grid': GridBlock,
      'module.images': (props: any) => (
        <ImagesBlock centered={centered} {...props} />
      ),
      'module.instagram': InstagramBlock,
      'module.products': ProductsBlock,
    },
  };

  const portableText = useMemo(() => {
    return (
      <div className={clsx('portableText', className)}>
        <PortableTextReact value={blocks} components={components} />
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks]);

  return portableText;
}
