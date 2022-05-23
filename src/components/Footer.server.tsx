import type {Block} from '@sanity/types';
import {Link} from '@shopify/hydrogen';
import groq from 'groq';
import {useSanityQuery} from 'hydrogen-plugin-sanity';
import clientConfig from '../../sanity.config';
import {LINKS} from '../fragments/links';
import {PORTABLE_TEXT} from '../fragments/portableText';
import type {SanityLink} from '../types';
import DebugWrapper from './DebugWrapper';

/**
 * A server component that specifies the content of the footer on the website
 */
export default function Footer() {
  const {sanityData: footer} = useSanityQuery<{
    links: SanityLink[];
    text: Block[];
  }>({
    clientConfig,
    getProductGraphQLFragment: () => false,
    query: QUERY,
  });

  const renderLinks = footer?.links.map((link) => {
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
          <div className="font-bold">(Logo)</div>
          <div className="mt-4 grid max-w-2xl grid-cols-1 md:grid-cols-2">
            {renderLinks}
          </div>
        </div>
      </DebugWrapper>
      <div className="py-4 text-sm">
        <p>© {new Date().getFullYear()} – AKVA. All rights reserved.</p>
      </div>
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
