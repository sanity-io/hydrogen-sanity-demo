import type {Storefront as HydrogenStorefront} from '@shopify/hydrogen';
import type {
  Collection,
  CountryCode,
  CurrencyCode,
  Customer,
  LanguageCode,
  MailingAddress,
  MailingAddressConnection,
  MediaConnection,
  Order,
  OrderLineItemConnection,
  Product,
  ProductVariantConnection,
} from '@shopify/hydrogen/storefront-api-types';

export type Locale = {
  language: LanguageCode;
  country: CountryCode;
  label: string;
  currency: CurrencyCode;
};

export type Localizations = Record<string, Locale>;

export type I18nLocale = Locale & {
  pathPrefix: string;
};

export type Storefront = HydrogenStorefront<I18nLocale>;

export enum CartAction {
  ADD_TO_CART = 'ADD_TO_CART',
  REMOVE_FROM_CART = 'REMOVE_FROM_CART',
  UPDATE_CART = 'UPDATE_CART',
  UPDATE_DISCOUNT = 'UPDATE_DISCOUNT',
  UPDATE_BUYER_IDENTITY = 'UPDATE_BUYER_IDENTITY',
}
export type CartActions = keyof typeof CartAction;

export type CollectionWithNodes = Partial<Omit<Collection, 'products'>> & {
  products: {
    nodes: ProductWithNodes[];
  };
};

export type CustomerWithNodes = Omit<Customer, 'addresses' | 'orders'> & {
  addresses: {
    nodes: MailingAddressConnection['nodes'];
  };
  orders: {
    nodes: OrderWithNodes[];
  };
};

export type MailingAddressExtended = MailingAddress & {
  originalId: string;
};

export type OrderWithNodes = Omit<Order, 'lineItems'> & {
  lineItems: {
    nodes: OrderLineItemConnection['nodes'];
  };
};

export type ProductWithNodes = Partial<Omit<Product, 'media' | 'variants'>> & {
  media?: {
    nodes: MediaConnection['nodes'];
  };
  variants: {
    nodes: ProductVariantConnection['nodes'];
  };
};
