import {Block} from '@sanity/types';

export type SanityCollection = {
  _id: string;
  slug: string;
  store: Record<string, any>;
  title: string;
};

export type SanityCollectionGroup = {
  _key: string;
  _type: 'collectionGroup';
  collectionLinks?: SanityCollection[];
  collectionProducts?: SanityCollection;
  title: string;
};

export type SanityLink = SanityLinkExternal | SanityLinkInternal;

export type SanityMenuLink =
  | SanityCollectionGroup
  | SanityLinkExternal
  | SanityLinkInternal;

export type SanityLinkExternal = {
  _key: string;
  _type: 'linkExternal';
  newWindow?: boolean;
  url: string;
  title: string;
};

export type SanityLinkInternal = {
  _key: string;
  _type: 'linkInternal';
  documentType: string;
  slug: string;
  title: string;
};

export type SanityProduct = {
  _id: string;
  available: boolean;
  body: Block[];
  images?: any;
  slug: string;
  sections?: any;
  seo?: any;
  store: Record<string, any>;
};
