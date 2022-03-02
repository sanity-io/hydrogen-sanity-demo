import {flattenConnection, Seo} from '@shopify/hydrogen';
import groq from 'groq';
import {useSanityQuery} from 'hydrogen-plugin-sanity';
import {encode} from 'shopify-gid';
import clientConfig from '../../../sanity.config';
import Layout from '../../components/Layout.server';
import NotFound from '../../components/NotFound.server';
import ProductDetails from '../../components/ProductDetails.client';
import ProductsProvider from '../../contexts/ProductsProvider.client';
import {PRODUCT_PAGE} from '../../fragments/productPage';

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
  const params = new URLSearchParams(props.search);
  const variantId = props?.variantId || params?.get('variant');

  // Obtain encoded product ID and current variant
  const productVariantIdEncoded = encode('ProductVariant', variantId);
  const flattenedVariants = flattenConnection(product.storefront.variants);
  const currentStorefrontVariant =
    flattenedVariants.find(
      (variant) => variant.id === productVariantIdEncoded,
    ) || flattenedVariants[0];

  return (
    <ProductsProvider value={shopifyProducts}>
      <Layout>
        <ProductDetails
          initialVariantId={currentStorefrontVariant?.id}
          product={product}
        />

        {/* SEO */}
        <Seo
          data={{
            ...product.storefront,
            // TODO: add seo image, if present
            featuredImage: {},
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
