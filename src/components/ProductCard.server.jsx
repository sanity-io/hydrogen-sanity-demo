import {
  flattenConnection,
  Image,
  ProductPrice,
  ProductProvider,
  ProductTitle,
} from '@shopify/hydrogen';
import {encode} from 'shopify-gid';
import ButtonSelectedVariantAddToCart from './ButtonSelectedVariantAddToCart.client';
import LinkProduct from './LinkProduct.client';

const ProductCard = (props) => {
  const {product} = props;

  if (!product.storefront) {
    return null;
  }

  // Obtain encoded product ID and current variant
  const productVariantIdEncoded = encode('ProductVariant', product?.variantId);
  const currentStorefrontVariant = flattenConnection(
    product.storefront.variants,
  )?.find((variant) => variant.id === productVariantIdEncoded);

  return (
    <ProductProvider
      data={product.storefront}
      initialVariantId={productVariantIdEncoded}
    >
      <div className="bg-white col-span-2 group">
        {/* Image */}
        <div className="overflow-hidden relative">
          <div className="aspect-w-6 aspect-h-4 bg-gray-100">
            <LinkProduct handle={product?.slug} variantId={product?.variantId}>
              <Image
                className="absolute h-full object-cover w-full"
                data={currentStorefrontVariant.image}
                options={{width: 800}}
              />
            </LinkProduct>
          </div>
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
          <ProductPrice
            className="text-gray-900"
            variantId={currentStorefrontVariant.id}
          />
          <ProductPrice
            className="ml-1 text-gray-400 line-through"
            priceType="compareAt"
            variantId={currentStorefrontVariant.id}
          />
        </div>
      </div>
    </ProductProvider>
  );
};

export default ProductCard;
