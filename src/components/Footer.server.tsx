import type {Block} from '@sanity/types';
import {Link} from '@shopify/hydrogen';
import groq from 'groq';
import {useSanityQuery} from 'hydrogen-plugin-sanity';
import clientConfig from '../../sanity.config';
import {LINKS} from '../fragments/links';
import {PORTABLE_TEXT} from '../fragments/portableText';
import type {SanityLink} from '../types';
import IconLogo from './icons/IconLogo';

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
          <p className="mt-12 text-sm text-darkGray">
            Made by Sanity, Companion and Ewa Lefmann
          </p>
        </div>

        <div className="columns-2 gap-x-17 self-start rounded-xl text-lg font-bold">
          {renderLinks}
        </div>
      </div>

      <div className="-my-overlap bg-[#121923] pt-overlap text-white">
        <div className="mx-auto max-w-[41rem] px-8 py-12 text-center text-xl">
          This is a demo store that Sanity have created along with Shopify's
          Hydrogen framework, powered by our free and official Sanity Connect
          App on Shopify.
          <br />
          (Links to follow)
        </div>
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
