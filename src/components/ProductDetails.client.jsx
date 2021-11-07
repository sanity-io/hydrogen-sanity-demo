import {Disclosure} from '@headlessui/react';
import {ChevronUpIcon} from '@heroicons/react/outline';
import {Product} from '@shopify/hydrogen/client';

import ButtonSelectedVariantAddToCart from './ButtonSelectedVariantAddToCart.client';
import ButtonSelectedVariantBuyNow from './ButtonSelectedVariantBuyNow.client';
import PortableText from './PortableText.client';
import ProductGallery from './ProductGallery.client';
import ProductOptions from './ProductOptions.client';

export default function ProductDetails({product, initialVariantId}) {
  return (
    <div className="p-4">
      <Product product={product.storefront} initialVariantId={initialVariantId}>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          <section className="lg:col-span-2 grid gap-10" aria-label="Gallery">
            {/* Image gallery */}
            {product?.images && (
              <div className="mb-10">
                <ProductGallery images={product.images} />
              </div>
            )}

            {/* Body */}
            {product?.body && (
              <div className="max-w-2xl">
                <PortableText blocks={product.body} />
              </div>
            )}
          </section>

          <section
            className="my-4 md:my-0 md:row-start-auto max-w-md flex flex-col gap-6 row-start-1"
            aria-label="Product details"
          >
            {/* eslint-disable-next-line @shopify/jsx-prefer-fragment-wrappers */}
            <div>
              <Product.Title className="text-gray-900 font-medium" />
              <div className="gap-1">
                <Product.SelectedVariant.Price className="font-medium text-gray-900">
                  {({currencyCode, amount, currencyNarrowSymbol}) => {
                    return (
                      <span>{`${currencyCode} ${currencyNarrowSymbol}${amount}`}</span>
                    );
                  }}
                </Product.SelectedVariant.Price>
                <Product.SelectedVariant.Price
                  priceType="compareAt"
                  className="text-gray-400 line-through"
                >
                  {({amount, currencyNarrowSymbol}) => {
                    return <span>{`${currencyNarrowSymbol}${amount}`}</span>;
                  }}
                </Product.SelectedVariant.Price>
                {/*
                <Product.SelectedVariant.UnitPrice className="text-gray-900 text-base">
                  {({
                    currencyCode,
                    amount,
                    currencyNarrowSymbol,
                    referenceUnit,
                  }) => {
                    return (
                      <span>{`${currencyCode} ${currencyNarrowSymbol}${amount}/${referenceUnit}`}</span>
                    );
                  }}
                </Product.SelectedVariant.UnitPrice>
                */}
              </div>

              {/* Product options */}
              <div className="mt-5">
                <ProductOptions />
              </div>

              {/* Product actions: Add to cart, buy now buttons, etc */}
              <div className="my-8 space-y-2">
                <ButtonSelectedVariantAddToCart />
                <ButtonSelectedVariantBuyNow showSoldOut={false} />
              </div>

              {/* Custom sections */}
              <div className="my-4">
                {product?.sections?.map((section) => (
                  <Disclosure key={section?._key}>
                    {({open}) => (
                      <>
                        <Disclosure.Button className="border-b border-gray-400 flex font-medium items-center justify-between text-md py-2 w-full">
                          <span>{section?.title}</span>
                          <ChevronUpIcon
                            className={`${
                              open ? 'transform rotate-180' : ''
                            } w-5 h-5 scale-75 text-black`}
                          />
                        </Disclosure.Button>
                        <Disclosure.Panel className="mt-2 text-gray-600 text-sm">
                          {section?.body && (
                            <PortableText blocks={section.body} />
                          )}
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </div>
            </div>
          </section>
        </div>
      </Product>
    </div>
  );
}
