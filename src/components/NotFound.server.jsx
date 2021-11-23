import {Link} from '@shopify/hydrogen/client';
import Layout from './Layout.server';

export default function NotFound() {
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
    </Layout>
  );
}
