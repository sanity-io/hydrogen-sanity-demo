import {useParsedMetafields, useProduct} from '@shopify/hydrogen/client';
import DebugWrapper from './DebugWrapper';

function SizeChart() {
  return (
    <>
      <h3 className="font-medium mb-2" id="size-chart">
        Size Chart
      </h3>
      <table className="min-w-full table-fixed text-sm text-center bg-white">
        <thead>
          <tr className="bg-black text-white">
            <th className="w-1/4 py-2 px-4 font-normal">Board Size</th>
            <th className="w-1/4 py-2 px-4 font-normal">154</th>
            <th className="w-1/4 py-2 px-4 font-normal">158</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-3 border border-black">Weight Range</td>
            <td className="p-3 border border-black">120-180 lbs. /54-82kg</td>
            <td className="p-3 border border-black">150-200 lbs. /68-91 kg</td>
          </tr>
          <tr>
            <td className="p-3 border border-black">Waist Width</td>
            <td className="p-3 border border-black">246mm</td>
            <td className="p-3 border border-black">255mm</td>
          </tr>
          <tr>
            <td className="p-3 border border-black">Stance Width</td>
            <td className="p-3 border border-black">-40</td>
            <td className="p-3 border border-black">-40</td>
          </tr>
          <tr>
            <td className="p-3 border border-black">Binding Sizes</td>
            <td className="p-3 border border-black">
              Men&rsquo;s S/M, Women&rsquo;s S/M
            </td>
            <td className="p-3 border border-black">
              Men&rsquo;s L, Women&rsquo;s L
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default function ProductMetafields() {
  const product = useProduct();

  const productMetafields = useParsedMetafields(product.metafields || {});
  const sizeChartMetafield = productMetafields.find(
    (metafield) =>
      metafield.namespace === 'my_fields' && metafield.key === 'size_chart',
  );
  const sustainableMetafield = productMetafields.find(
    (metafield) =>
      metafield.namespace === 'my_fields' && metafield.key === 'sustainable',
  );
  const lifetimeWarrantyMetafield = productMetafields.find(
    (metafield) =>
      metafield.namespace === 'my_fields' &&
      metafield.key === 'lifetime_warranty',
  );

  return (
    <>
      {/* Metafield: size chart */}
      {sizeChartMetafield?.value && (
        <a
          href="#size-chart"
          className="block underline text-gray-500 text-sm my-4"
        >
          Size Chart
        </a>
      )}

      {/* Metafield: sustainable material */}
      {sustainableMetafield?.value && (
        <DebugWrapper name="Metafield: sustainable material" shopify>
          <div className="flex items-center w-full">
            <span className="text-sm">{sustainableMetafield.value}</span>
          </div>
        </DebugWrapper>
      )}

      {/* Metafield: lifetime warranty */}
      {lifetimeWarrantyMetafield?.value && (
        <DebugWrapper name="Metafield: lifetime warranty" shopify>
          <span className="flex items-center mb-8">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current text-blue-600 mr-3"
            >
              <path
                d="M9 12L11 14L15 10M20.6179 5.98434C20.4132 5.99472 20.2072 5.99997 20 5.99997C16.9265 5.99997 14.123 4.84453 11.9999 2.94434C9.87691 4.84446 7.07339 5.99985 4 5.99985C3.79277 5.99985 3.58678 5.9946 3.38213 5.98422C3.1327 6.94783 3 7.95842 3 9.00001C3 14.5915 6.82432 19.2898 12 20.622C17.1757 19.2898 21 14.5915 21 9.00001C21 7.95847 20.8673 6.94791 20.6179 5.98434Z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm text-gray-900 font-medium">
              Lifetime Warranty
            </span>
          </span>
        </DebugWrapper>
      )}

      {/* Metafield: size chart*/}
      {sizeChartMetafield?.value && (
        <DebugWrapper name="Metafield: size chart" shopify>
          <SizeChart />
        </DebugWrapper>
      )}
    </>
  );
}
