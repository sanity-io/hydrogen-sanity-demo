import {Product} from '@shopify/hydrogen/client';

import ButtonSelectedVariantAddToCart from './ButtonSelectedVariantAddToCart.client';
import ButtonSelectedVariantBuyNow from './ButtonSelectedVariantBuyNow.client';
import PortableText from './PortableText.client';
import ProductGallery from './ProductGallery.client';
import ProductOptions from './ProductOptions.client';

export default function ProductDetails({product}) {
  const initialVariantId = product.storefront.variants.edges[0].node.id;

  return (
    <div className="p-4">
      <Product product={product.storefront} initialVariantId={initialVariantId}>
        <div className="md:grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          <section className="lg:col-span-2 grid gap-10" aria-label="Gallery">
            {product?.images && <ProductGallery images={product.images} />}

            {/* <div className="bg bg-red-500 p-4">test</div> */}
          </section>

          <section
            className="my-4 md:my-0 max-w-md flex flex-col gap-6"
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
                  <div className="mb-8" key={section?._key}>
                    <div className="font-medium text-sm">{section?.title}</div>
                    <div className="text-gray-500 text-sm">
                      {section?.body && <PortableText blocks={section.body} />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Divider */}
        {product?.body && <div className="bg-gray-300 h-px my-10 w-full" />}

        {/* Body */}
        {product?.body && (
          <div className="max-w-2xl mt-10">
            <PortableText blocks={product.body} />
          </div>
        )}
      </Product>
    </div>
  );
}
