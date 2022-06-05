import {Block} from '@sanity/types';

export type SanityCollection = {
  _id: string;
  colorTheme: SanityColorTheme;
  gid: string;
  hero?: SanityHeroPage;
  slug: string;
  title: string;
  vector?: string;
};

export type SanityCollectionPage = {
  _id: string;
  colorTheme: SanityColorTheme;
  hero?: SanityHeroCollection;
  modules: (SanityModuleImage | SanityModuleInstagram)[];
  slug: string;
  sortOrder: string;
  title: string;
};

export type SanityCollectionGroup = {
  _key: string;
  _type: 'collectionGroup';
  collectionLinks?: SanityCollection[];
  collectionProducts?: SanityCollection;
  title: string;
};

export type SanityColorTheme = {
  background: string;
  text: string;
};

export type SanityCustomProductOption =
  | SanityCustomProductOptionColor
  | SanityCustomProductOptionSize;

interface SanityCustomProductOptionBase {
  _key: string;
  title: string;
}
export interface SanityCustomProductOptionColor
  extends SanityCustomProductOptionBase {
  _type: 'customProductOption.color';
  colors: {
    hex: string;
    title: string;
  }[];
}

export interface SanityCustomProductOptionSize
  extends SanityCustomProductOptionBase {
  _type: 'customProductOption.size';
  sizes: {
    height: number;
    title: string;
    width: number;
  }[];
}

export type SanityHero = SanityHeroCollection | SanityHeroHome | SanityHeroPage;

export type SanityHeroCollection = {
  content?: SanityAssetImage | SanityProductWithVariant;
  description?: string;
  title?: string;
};

export type SanityHeroHome = {
  content?: SanityAssetImage | SanityProductWithVariant;
  link?: SanityLink;
  title?: string;
};

export type SanityHeroPage = {
  content?: SanityAssetImage | SanityProductWithVariant;
  title?: string;
};

export type SanityHomePage = {
  hero?: SanityHeroHome;
  modules: (SanityModuleImage | SanityModuleInstagram)[];
};

export type SanityAssetImage = any;

export type SanityLink = SanityLinkExternal | SanityLinkInternal;

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

export type SanityMenuLink =
  | SanityCollectionGroup
  | SanityLinkExternal
  | SanityLinkInternal;

export type SanityModule =
  | SanityModuleCallout
  | SanityModuleCallToAction
  | SanityModuleCollection
  | SanityModuleImage
  | SanityModuleInstagram
  | SanityModuleProduct;

export type SanityModuleCallout = {
  _key?: string;
  _type: 'module.callout';
  link: SanityLink;
  text: string;
};

export type SanityModuleCallToAction = {
  _key?: string;
  _type: 'module.callToAction';
  body?: string;
  content?: SanityAssetImage | SanityProductWithVariant;
  layout: 'left' | 'right';
  link: SanityLink;
  title: string;
};

export type SanityModuleCollection = {
  _key?: string;
  _type: 'module.collection';
  collection: SanityCollection;
};

export type SanityModuleImage =
  | SanityModuleImageCallToAction
  | SanityModuleImageCaption
  | SanityModuleImageProducts;

export type SanityModuleImageBase = {
  _key?: string;
  _type: 'module.image';
  image: SanityAssetImage;
};

export interface SanityModuleImageCallToAction extends SanityModuleImageBase {
  callToAction?: {
    link: SanityLink;
    title?: string;
  };
  variant: 'callToAction';
}

export interface SanityModuleImageCaption extends SanityModuleImageBase {
  caption?: string;
  variant: 'caption';
}
export interface SanityModuleImageProducts extends SanityModuleImageBase {
  products: SanityProductWithVariant[];
  variant: 'products';
}

export type SanityModuleInstagram = {
  _key?: string;
  _type: 'module.instagram';
  url: string;
};

export type SanityModuleProduct = {
  _key?: string;
  _type: 'module.product';
  productWithVariant: SanityProductWithVariant;
};

export type SanityNotFoundPage = {
  body?: string;
  collectionGid?: string;
  colorTheme?: SanityColorTheme;
  title: string;
};

export type SanityPage = {
  body: Block[];
  colorTheme?: SanityColorTheme;
  hero?: SanityHeroPage;
  // seo: null,
  showHeader?: boolean;
  title: string;
};

export type SanityProductWithVariant = {
  _id: string;
  _type: 'productWithVariant';
  available: boolean;
  gid: string;
  slug: string;
  variantGid: string;
};

export type SanityProductPage = {
  _id: string;
  available: boolean;
  body: Block[];
  colorTheme?: SanityColorTheme;
  customProductOptions?: SanityCustomProductOption[];
  gid: string;
  images?: SanityAssetImage[];
  slug: string;
  sections?: any;
  seo?: any;
};
