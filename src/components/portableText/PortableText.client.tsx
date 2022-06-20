import BlockContent from '@sanity/block-content-to-react';
import type {Block as SanityBlock} from '@sanity/types';
import clsx from 'clsx';
import LinkEmailAnnotation from './annotations/LinkEmail';
import LinkExternalAnnotation from './annotations/LinkExternal';
import LinkInternalAnnotation from './annotations/LinkInternal';
import Block from './blocks/Block';
import ListBlock from './blocks/List';

type Props = {
  blocks: SanityBlock[];
  className?: string;
};

export default function PortableText({blocks, className}: Props) {
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
        },
        // Block types
        types: {
          block: Block,
        },
      }}
    />
  );
}
