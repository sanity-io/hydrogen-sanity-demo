import {Link} from '@shopify/hydrogen';
import DebugWrapper from './DebugWrapper';

/**
 * A server component that specifies the content of the footer on the website
 */
export default function Footer({collection, product}) {
  return (
    <footer className="border-t border-black" role="contentinfo">
      <DebugWrapper name="Footer">
        <div className="relative">
          <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-12 mt-4">
            <div>
              <h2 className="text-md font-medium mb-2">Community</h2>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://github.com/Shopify/hydrogen/discussions"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center"
                  >
                    Github discussions
                  </a>
                </li>
                <li>
                  <a
                    href="https://discord.gg/ppSbThrFaS"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center"
                  >
                    Discord
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-md font-medium mb-2">Templates</h2>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Link to="/home">Home</Link>
                </li>
                <li className="flex items-center">
                  <Link to={`/products/${product?.handle}`}>Product</Link>
                </li>
                <li className="flex items-center">
                  <Link to={`/collections/${collection?.handle}`}>
                    Collection
                  </Link>
                </li>
                <li className="flex items-center">
                  <Link to="/404">404</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="py-4">
          <p>© {new Date().getFullYear()} Sanity.io</p>
        </div>
      </DebugWrapper>
    </footer>
  );
}
