import {Link} from '@shopify/hydrogen/client';
import Layout from './Layout.server';

export default function NotFound({response}) {
  /*
  // TODO: understand why this breaks with "TypeError: This stream has already been locked for exclusive reading by another reader" 
  // https://github.com/Shopify/hydrogen/issues/867

  if (response) {
    response.doNotStream();
    response.writeHead({status: 404, statusText: 'Not found'});
  }
  */

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
