import {
  Image,
  ProductPrice,
  ProductProvider,
  ProductTitle,
} from '@shopify/hydrogen';
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
            </div>
          )}
          {/* Quick add to cart button */}
          <div className="absolute bottom-0 duration-300 group-hover:translate-y-0 left-0 transform-gpu transition-transform translate-y-full w-full">
            <ButtonSelectedVariantAddToCart />
          </div>
        </div>

        {/* Title */}
        <div className="font-medium mt-2">
          <LinkProduct handle={product?.slug} variantId={product?.variantId}>
            <ProductTitle />
          </LinkProduct>
        </div>
        <div className="flex items-center">
          <ProductPrice className="text-gray-900" />
          <ProductPrice
            className="ml-1 text-gray-400 line-through"
            priceType="compareAt"
            variantId={currentVariant.id}
          />
        </div>
      </div>
    </ProductProvider>
  );
};

export default ProductCard;
