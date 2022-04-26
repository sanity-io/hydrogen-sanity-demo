import {Disclosure} from '@headlessui/react';
import {ChevronUpIcon} from '@heroicons/react/outline';
import {
  Image,
  ProductPrice,
  ProductProvider,
  ProductTitle,
  useProduct,
} from '@shopify/hydrogen/client';
import {useEffect, useState} from 'react';
import ButtonSelectedVariantAddToCart from './ButtonSelectedVariantAddToCart.client';
import ButtonSelectedVariantBuyNow from './ButtonSelectedVariantBuyNow.client';
import PortableText from './PortableText.client';
import ProductGallery from './ProductGallery.client';
import ProductOptions from './ProductOptions.client';

const ProductDetailsContent = ({product}) => {
  const {selectedVariant} = useProduct();
  const [disclosureVisible, setDisclosureVisible] = useState(false);

  // HACK: temporarily render disclosure buttons post-mount to prevent hydration issues with @headlessui/react
  useEffect(() => {
    setDisclosureVisible(true);
  }, []);

  return (
    <div className="p-4">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
        <section className="lg:col-span-2 grid gap-5" aria-label="Gallery">
          {/* Selected variant image */}
          {selectedVariant.image && (
            <div className="aspect-w-4 aspect-h-3 bg-gray-50 w-full">
              <Image
                className="object-cover"
                data={selectedVariant.image}
                options={{width: 2000}}
              />
            </div>
          )}

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
          <div>
            <ProductTitle className="text-gray-900 font-medium" />
            <div className="gap-1">
              <ProductPrice
                className="font-medium text-gray-900"
                variantId={selectedVariant.id}
              />
              <ProductPrice
                className="text-gray-400 line-through"
                priceType="compareAt"
                variantId={selectedVariant.id}
              />
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
              {disclosureVisible &&
                product?.sections?.map((section) => (
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
    </div>
  );
};

export default function ProductDetails({product, initialVariantId}) {
  return (
    <ProductProvider
      data={product.storefront}
      initialVariantId={initialVariantId}
    >
      <ProductDetailsContent product={product} />
    </ProductProvider>
  );
}
