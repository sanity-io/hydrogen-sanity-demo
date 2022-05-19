import {Link} from '@shopify/hydrogen';
import groq from 'groq';
import {useSanityQuery} from 'hydrogen-plugin-sanity';
import clientConfig from '../../sanity.config';
import {LINKS} from '../fragments/links';
import {PORTABLE_TEXT} from '../fragments/portableText';
import DebugWrapper from './DebugWrapper';

/**
 * A server component that specifies the content of the footer on the website
 */
export default function Footer({collection, product}) {
  const {sanityData: footer} = useSanityQuery({
    query: QUERY,
    // No need to query Shopify product data ✨
    getProductGraphQLFragment: () => false,
    clientConfig,
  });

  const renderLinks = footer.links.map((link) => {
    if (link._type === 'linkExternal') {
      return (
        <div key={link._key}>
          <a
            href={link.url}
            rel="noreferrer"
            target={link.newWindow ? '_blank' : '_self'}
          >
            {link.title}
          </a>
        </div>
      );
    }
    if (link._type === 'linkInternal') {
      if (!link.slug) {
        return null;
      }

      return (
        <div key={link._key}>
          <Link to={link.slug}>{link.title}</Link>
        </div>
      );
    }
    return null;
  });

  return (
    <footer role="contentinfo">
      <DebugWrapper name="Footer">
        <div className="relative">
          <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-12 mt-4">
            {renderLinks}
          </div>
        </div>
        <div className="py-4">
          <p>© {new Date().getFullYear()} Sanity.io</p>
        </div>
      </DebugWrapper>
    </footer>
  );
}
const QUERY = groq`
  *[_type == 'settings'][0].footer {
    links[] {
      ${LINKS}
    },
    text[]{
      ${PORTABLE_TEXT}
    },
  }
`;
