import groq from 'groq';
import {useParams} from 'react-router-dom';

import Layout from '../../components/Layout.client';
import NotFound from '../../components/NotFound.server';
import ProductDetails from '../../components/ProductDetails.client';
import Seo from '../../components/Seo.client';
import ProductsProvider from '../../contexts/ProductsProvider.client';
import {PRODUCT} from '../../fragments/product';
import useSanityQuery from '../../utils/query/useSanityQuery';

export default function Product() {
  const {handle} = useParams();
  const {sanityData: sanityProduct, shopifyProducts} = useSanityQuery({
    query: QUERY,
    params: {
      slug: handle,
    },
  });

  const storefrontProduct = shopifyProducts?.[sanityProduct?._id];

  if (!sanityProduct || !storefrontProduct) {
    return <NotFound />;
  }

  const product = {
    ...sanityProduct,
    storefront: storefrontProduct,
  };

  // TODO: get current variant
  const productVariant = product.storefront?.variants?.edges[0];

  return (
    <ProductsProvider value={shopifyProducts}>
      <Layout>
        <ProductDetails product={product} />

        {/* SEO */}
        <Seo
          page={{
            description: product.seo?.description,
            image: product.seo?.image,
            keywords: product.seo?.keywords,
            product: {
              availableForSale: productVariant?.node?.availableForSale,
              description: product.seo?.description,
              price: productVariant?.node?.priceV2,
              title: product.seo?.title,
            },
            title: product.seo?.title,
            type: 'product',
          }}
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
    ${PRODUCT}
  }
`;
