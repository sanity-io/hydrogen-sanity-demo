import {Seo, useRouteParams, useSession} from '@shopify/hydrogen';
import {Product} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import groq from 'groq';
import {useSanityQuery} from 'hydrogen-plugin-sanity';
import clientConfig from '../../../sanity.config';
import Layout from '../../components/Layout.server';
import NotFound from '../../components/NotFound.server';
import ProductDetails from '../../components/ProductDetails.client';
import ProductEditorial from '../../components/ProductEditorial.server';
import RelatedProducts from '../../components/RelatedProducts.server';
import {PRODUCT_PAGE} from '../../fragments/productPage';
import type {SanityProduct} from '../../types';

type SanityPayload = {
  sanityData: SanityProduct;
  shopifyProducts: Record<string, Product>;
};

export default function ProductRoute() {
  const {handle} = useRouteParams();
  const {countryCode = 'US'} = useSession();

  // TODO: add `preload` support to `useSanityQuery`
  const {sanityData: sanityProduct, shopifyProducts} = useSanityQuery({
    clientConfig,
    params: {
      slug: handle,
    },
    query: QUERY,
    shopifyVariables: {
      country: countryCode,
    },
  }) as SanityPayload;

  const storefrontProduct = shopifyProducts?.[sanityProduct?._id];

  if (!sanityProduct || !storefrontProduct) {
    // @ts-expect-error <NotFound> doesn't require response
    return <NotFound />;
  }

  return (
    <Layout>
      <Seo type="product" data={storefrontProduct} />
      <ProductDetails
        sanityProduct={sanityProduct}
        storefrontProduct={storefrontProduct}
      />
      <ProductEditorial sanityProduct={sanityProduct} />

      {/* Related products */}
      <RelatedProducts storefrontProduct={storefrontProduct} />
    </Layout>
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
