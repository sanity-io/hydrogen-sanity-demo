// import {useShopQuery, MediaFile} from '@shopify/hydrogen';
import {Link} from '@shopify/hydrogen/client';
// import gql from 'graphql-tag';
import Layout from './Layout.client';
// import ProductCard from './ProductCard.client';

export default function NotFound() {
  // const {data} = useShopQuery({query: QUERY});
  // const {products} = data;

  return (
    <Layout>
      <div className="max-w-2xl p-4 space-y-6">
        <h1>Page not found</h1>
        <p>
          We couldn’t find the page you’re looking for. Try checking the URL or
          heading back to the home page.
        </p>
        <div>
          <Link className="inline-block text-white p-3 text-sm bg-black" to="/">
            Back home
          </Link>
        </div>
      </div>

      {/*
      <h2 className="my-8 text-2xl text-gray-700 font-bold">
        Products you might like
      </h2>

      <ul className="grid lg:grid-cols-3 gap-6 my-4">
        {products.edges.map((edge) => (
          <li key={edge.node.id}>
            <ProductCard product={edge.node} />
          </li>
        ))}
      </ul>
      */}
    </Layout>
  );
}

/*
const QUERY = gql`
  fragment NotFoundProductDetails on Product {
    id
    title
    handle
    priceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 1) {
      edges {
        node {
          priceV2 {
            currencyCode
            amount
          }
          compareAtPriceV2 {
            currencyCode
            amount
          }
          image {
            ...ImageFragment
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
    media(first: 1) {
      edges {
        node {
          ...MediaFileFragment
        }
      }
    }
  }

  query Products {
    products(first: 3) {
      edges {
        node {
          id
          ...NotFoundProductDetails
        }
      }
    }
  }

  ${MediaFile.Fragment}
`;
*/
