import groq from 'groq';

import type {SanityNotFoundPage} from '~/types/sanity';
import type {CollectionWithNodes, ProductWithNodes} from '~/types/shopify';

// import {NOT_FOUND_PAGE} from '../../fragments/sanity/pages/notFound';
// import {PRODUCT_FIELDS} from '../../fragments/shopify/product';
// import {PRODUCT_VARIANT_FIELDS} from '../../fragments/shopify/productVariant';
// import ProductPill from '../product/Pill';

/**
 * A component that defines the content to display when a page isn't found (404 error)
 */

export function NotFound({sanityData}: {sanityData: SanityNotFoundPage}) {
  return (
    <div className="pt-34">
      <h1 className="mx-auto px-12 text-center text-4xl sm:max-w-2xl">
        {sanityData?.title || 'Page not found'}
      </h1>

      <p className="my-8 text-center">
        {sanityData?.body || "We couldn't find the page you're looking for."}
      </p>

      {/* TODO: A collection from API
      <div className="mx-4 mb-18 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products?.map((product) => (
            <div key={product.id}>
              <ProductPill storefrontProduct={product} />
            </div>
          ))}
        </div> */}
    </div>
  );
}

// const QUERY_SANITY = groq`
//   *[_type == 'settings'][0] {
//     ...notFoundPage {
//       ${NOT_FOUND_PAGE}
//     }
//   }
// `;

// const QUERY_SHOPIFY = gql`
//   ${PRODUCT_FIELDS}
//   ${PRODUCT_VARIANT_FIELDS}

//   query NotFoundCollectionProductDetails(
//     $country: CountryCode
//     $id: ID!
//     $language: LanguageCode
//   ) @inContext(country: $country, language: $language) {
//     collection(id: $id) {
//       products(first: 16) {
//         nodes {
//           ...ProductFields
//           variants(first: 1) {
//             nodes {
//               ...ProductVariantFields
//             }
//           }
//         }
//       }
//     }
//   }
// `;
