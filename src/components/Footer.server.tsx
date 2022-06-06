import type {Block} from '@sanity/types';
import {Link} from '@shopify/hydrogen';
import groq from 'groq';
import {useSanityQuery} from 'hydrogen-plugin-sanity';
import clientConfig from '../../sanity.config';
import {LINKS} from '../fragments/links';
import {PORTABLE_TEXT} from '../fragments/portableText';
import type {SanityLink} from '../types';
import IconLogo from './icons/IconLogo';
import PortableText from './PortableText.server';
import SanityFooter from './SanityFooter.server';

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
        <div className="mb-6" key={link._key}>
          <a
            className="linkTextNavigation"
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
        <div className="mb-6" key={link._key}>
          <Link className="linkTextNavigation" to={link.slug}>
            {link.title}
          </Link>
        </div>
      );
    }
    return null;
  });

  return (
    <footer className="-mt-overlap" role="contentinfo">
      <div className="align-start relative flex justify-between overflow-hidden rounded-xl bg-peach py-10 pl-8 pr-19">
        <div>
          <IconLogo />
          {footer?.text && (
            <PortableText
              blocks={footer.text}
              className="mt-12 text-sm text-darkGray"
            />
          )}
        </div>

        <div className="columns-2 gap-x-17 self-start rounded-xl text-lg font-bold">
          {renderLinks}
        </div>
      </div>

      <SanityFooter />
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
