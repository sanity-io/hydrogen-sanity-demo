// import {useProduct} from '@shopify/hydrogen';
import ProductMetafields from './Metafields.client';

export default function ProductDetails() {
  // const storefrontProduct = useProduct();

  return (
    <>
      <ProductMetafields />

      {/* HTML description */}
      {/*storefrontProduct?.descriptionHtml && (
        <div
          className="prose"
          dangerouslySetInnerHTML={{__html: storefrontProduct.descriptionHtml}}
        />
      )*/}
    </>
  );
}
