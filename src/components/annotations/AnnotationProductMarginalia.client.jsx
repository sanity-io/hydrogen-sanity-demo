import {Link, Product} from '@shopify/hydrogen/client';

import {useProductsContext} from '../../contexts/ProductsContext.client';
import ButtonSelectedVariantAddToCart from '../ButtonSelectedVariantAddToCart.client';
import ButtonSelectedVariantBuyNow from '../ButtonSelectedVariantBuyNow.client';

const AnnotationProductMarginalia = (props) => {
  const {children, mark} = props;

  const productId = mark?.product?._id;

  const product = useProductsContext(productId);
  // Return text only if no valid product is found
  if (!product) {
    return children;
  }

  const productVariant = product?.variants?.edges[0]?.node;
  const productUrl = `/products/${product.handle}`;

  return (
    <Product product={product} initialVariantId={productVariant?.id}>
      <>
        {children}
        <div className="absolute border border-gray-500 left-full ml-10 p-2 rounded-sm top-0 w-44">
          <div className="text-sm">
            <Link to={productUrl}>
              <Product.Title className="font-medium" />
            </Link>
            <Product.Price />
          </div>
          <Product.SelectedVariant.Image
            className="my-2 w-full"
            options={{
              height: '700',
              crop: 'center',
            }}
          />
          {mark?.action === 'addToCart' && (
            <ButtonSelectedVariantAddToCart small />
          )}
          {mark?.action === 'buyNow' && <ButtonSelectedVariantBuyNow small />}
        </div>
      </>
    </Product>
  );
};

export default AnnotationProductMarginalia;
