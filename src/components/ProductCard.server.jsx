import {
  Image,
  ProductPrice,
  ProductProvider,
  ProductTitle,
} from '@shopify/hydrogen';
import {Suspense} from 'react';
import {getProductVariant} from '../utils/getProductVariant';
import ButtonSelectedVariantAddToCart from './ButtonSelectedVariantAddToCart.client';
import LinkProduct from './LinkProduct.client';

const ProductCard = (props) => {
  const {product} = props;

  if (!product.storefront) {
    return null;
  }

  const currentVariant = getProductVariant(
    product.storefront,
    product?.variantId,
  );

  if (!currentVariant) {
    return null;
  }

  return (
    <ProductProvider
      data={product.storefront}
      initialVariantId={currentVariant.id}
    >
      <div className="bg-white col-span-2 group">
        {/* Image */}
        <div className="overflow-hidden relative">
          {currentVariant?.image && (
            <div className="aspect-w-6 aspect-h-4 bg-gray-100">
              <Suspense fallback={null}>
                <LinkProduct
                  handle={product?.slug}
                  variantId={product?.variantId}
                >
                  <Image
                    className="absolute h-full object-cover w-full"
                    data={currentVariant.image}
                    options={{width: 800}}
                  />
                </LinkProduct>
              </Suspense>
            </div>
          )}
          {/* Quick add to cart button */}
          <div className="absolute bottom-0 duration-300 group-hover:translate-y-0 left-0 transform-gpu transition-transform translate-y-full w-full">
            <Suspense fallback={null}>
              <ButtonSelectedVariantAddToCart />
            </Suspense>
          </div>
        </div>

        {/* Title */}
        <div className="font-medium mt-2">
          <Suspense fallback={null}>
            <LinkProduct handle={product?.slug} variantId={product?.variantId}>
              <ProductTitle />
            </LinkProduct>
          </Suspense>
        </div>
        <div className="flex items-center">
          <Suspense fallback={null}>
            <ProductPrice className="text-gray-900" />
          </Suspense>
          <Suspense fallback={null}>
            <ProductPrice
              className="ml-1 text-gray-400 line-through"
              priceType="compareAt"
              variantId={currentVariant.id}
            />
          </Suspense>
        </div>
      </div>
    </ProductProvider>
  );
};

export default ProductCard;
