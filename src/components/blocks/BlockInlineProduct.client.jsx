import {
  Link,
  MediaFile,
  Product,
  ProductProvider,
} from '@shopify/hydrogen/client';
import Tippy from '@tippyjs/react/headless';

import ButtonSelectedVariantAddToCart from '../ButtonSelectedVariantAddToCart.client';
import ButtonSelectedVariantBuyNow from '../ButtonSelectedVariantBuyNow.client';
import {useProductsContext} from '../../contexts/ProductsContext.client';

const BlockInlineLinkProduct = (props) => {
  const {node} = props;

  const productId = node?.product?._id;

  const product = useProductsContext(productId);
  // Return text only if no valid product is found
  if (!product) {
    return '(Product not found)';
  }

  const productTitle = product?.title;
  const productVariant = product?.variants?.edges[0]?.node;
  const productUrl = `/products/${product.handle}`;

  return (
    <Tippy
      interactive
      placement="bottom"
      render={(attrs) => (
        <ProductProvider
          product={product}
          initialVariantId={productVariant?.id}
        >
          <div
            className="bg-white border border-black p-2 text-sm"
            tabIndex="-1"
            {...attrs}
          >
            <div className="w-44">
              <div className="text-sm">
                <Product.Title className="font-medium" />
                <Product.Price />
              </div>
              <MediaFile
                className="my-2 w-full"
                media={{
                  mediaContentType: 'IMAGE',
                  image: productVariant?.image,
                }}
                options={{
                  height: '700',
                  crop: 'center',
                }}
              />
              {node?.action === 'addToCart' && (
                <ButtonSelectedVariantAddToCart small />
              )}
              {node?.action === 'buyNow' && (
                <ButtonSelectedVariantBuyNow small />
              )}
            </div>
          </div>
        </ProductProvider>
      )}
    >
      <Link className="underline" to={productUrl}>
        {productTitle}
      </Link>
    </Tippy>
  );
};

export default BlockInlineLinkProduct;
