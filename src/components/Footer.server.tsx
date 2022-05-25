import type {Block} from '@sanity/types';
import {Link} from '@shopify/hydrogen';
import groq from 'groq';
import {useSanityQuery} from 'hydrogen-plugin-sanity';
import clientConfig from '../../sanity.config';
import {LINKS} from '../fragments/links';
import {PORTABLE_TEXT} from '../fragments/portableText';
import type {SanityLink} from '../types';
import Logo from './Logo.client';

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
    <footer
      className="align-start flex justify-between bg-peach py-10 pl-8 pr-19"
      role="contentinfo"
    >
      <div>
        <Logo />
        <p className="mt-12 text-sm text-gray">
          Made by Sanity, Companion and Ewa Lefmann
        </p>
      </div>

      <div className="grid grid-cols-1 gap-x-17 gap-y-7 self-start text-lg font-bold md:grid-cols-2">
        {renderLinks}
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
