import {Link} from '@shopify/hydrogen/client';
import DebugWrapper from './DebugWrapper';

/**
 * A client component that defines the navigation for a web storefront
 */
export default function Navigation({collections}) {
  return (
    <nav className="hidden lg:block">
      <DebugWrapper name="Navigation">
        <ul className="md:flex items-center justify-start">
          {collections.map((collection) => (
            <li key={collection.id}>
              <Link
                to={`/collections/${collection.handle}`}
                className="block pr-4 hover:opacity-50"
              >
                {collection.title}
              </Link>
            </li>
          ))}
        </ul>
      </DebugWrapper>
    </nav>
  );
}
