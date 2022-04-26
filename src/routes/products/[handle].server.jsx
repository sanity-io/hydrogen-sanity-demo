import {Seo} from '@shopify/hydrogen';
import groq from 'groq';
import {useSanityQuery} from 'hydrogen-plugin-sanity';
import clientConfig from '../../../sanity.config';
import Layout from '../../components/Layout.server';
import NotFound from '../../components/NotFound.server';
import ProductDetails from '../../components/ProductDetails.client';
import ProductsProvider from '../../contexts/ProductsProvider.client';
import {PRODUCT_PAGE} from '../../fragments/productPage';
import {getProductVariant} from '../../utils/getProductVariant';
import sanityImageSeo from '../../utils/sanityImageSeo';

export default function Product(props) {
  const {handle} = props.params;
  const {sanityData: sanityProduct, shopifyProducts} = useSanityQuery({
    query: QUERY,
    params: {slug: handle},
    clientConfig,
  });

  const storefrontProduct = shopifyProducts?.[sanityProduct?._id];

  if (!sanityProduct || !storefrontProduct) {
    return <NotFound />;
  }

  const product = {
    ...sanityProduct,
    storefront: storefrontProduct,
  };

  // Obtain variant ID from server state or request search params, in that order
  const variantId =
    props?.variantId || new URLSearchParams(props.search)?.get('variant');

  const currentVariant = getProductVariant(product.storefront, variantId);

  return (
    <ProductsProvider value={shopifyProducts}>
      <Layout>
        <ProductDetails
          initialVariantId={currentVariant?.id}
          product={product}
        />
        {/* SEO */}
        <Seo
          data={{
            ...product.storefront,
            featuredImage: sanityImageSeo(sanityProduct?.seo?.image),
            seo: {
              description: sanityProduct.seo?.description,
              title: sanityProduct.seo?.title || sanityProduct?.store?.title,
            },
          }}
          type="product"
        />
      </Layout>
    </ProductsProvider>
  );
}

const QUERY = groq`
  *[
    _type == 'product'
    && store.slug.current == $slug
  ][0]{
    ${PRODUCT_PAGE}
  }
`;
