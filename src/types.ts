import {Block} from '@sanity/types';

export type SanityCollection = {
  _id: string;
  colorTheme: SanityColorTheme;
  hero?: SanityHeroPage;
  slug: string;
  store: Record<string, any>;
  title: string;
};

export type SanityCollectionPage = {
  _id: string;
  colorTheme: SanityColorTheme;
  hero?: SanityHeroCollection;
  slug: string;
  store: Record<string, any>;
  title: string;
};

export type SanityCollectionGroup = {
  _key: string;
  _type: 'collectionGroup';
  // TODO: use separate type
  collectionLinks?: SanityCollection[];
  collectionProducts?: SanityCollection;
  title: string;
};

export type SanityColorTheme = {
  background: string;
  text: string;
};

export type SanityCustomProductOption = SanityCustomProductOptionColor;

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

export type SanityMenuLink =
  | SanityCollectionGroup
  | SanityLinkExternal
  | SanityLinkInternal;

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

export type SanityPage = {
  body: Block[];
  colorTheme?: SanityColorTheme;
  hero?: SanityHeroPage;
  // seo: null,
  showHeader?: boolean;
  title: string;
};

export type SanityHeroCollection = {
  description?: string;
  module?:
    | SanityProductWithVariant
    | {
        _type: 'imageWithOptions';
        image: any;
      };
  title?: string;
};

export type SanityHeroPage = {
  module?:
    | SanityProductWithVariant
    | {
        _type: 'imageWithOptions';
        image: any;
      };
  title?: string;
};

export type SanityProductWithVariant = {
  _id: string;
  _type: 'productWithVariant';
  available: boolean;
  slug: string;
  store: Record<string, any>;
  variantId: number;
};

export type SanityProductPage = {
  _id: string;
  available: boolean;
  body: Block[];
  colorTheme?: SanityColorTheme;
  customProductOptions?: SanityCustomProductOption[];
  images?: any;
  slug: string;
  sections?: any;
  seo?: any;
  store: Record<string, any>;
};
