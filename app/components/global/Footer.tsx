import {useMatches} from '@remix-run/react';
import clsx from 'clsx';

import SanityFooter from '~/components/global/SanityFooter';
import LogoIcon from '~/components/icons/Logo';
import {Link} from '~/components/Link';
import PortableText from '~/components/portableText/PortableText';
import type {SanityLink} from '~/lib/sanity';

/**
 * A component that specifies the content of the footer on the website
 */
export default function Footer() {
  const [root] = useMatches();

  const layout = root.data?.layout;
  const {footer} = layout || {};

  const renderLinks = footer?.links?.map((link: SanityLink) => {
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
      {/* AVKA Footer */}
      <div
        className={clsx(
          'align-start relative overflow-hidden rounded-xl bg-peach px-4 py-8', //
          'md:px-8 md:py-10',
        )}
      >
        <div
          className={clsx(
            'flex flex-col justify-between', //
            'md:flex-row',
          )}
        >
          <div className="pb-4">
            <LogoIcon />
          </div>

          <div
            className={clsx(
              'my-16 w-full max-w-[22rem] columns-2 gap-x-8 self-start text-md font-bold',
              'md:my-0 md:max-w-[27rem]',
            )}
          >
            {renderLinks}
          </div>
        </div>
        {footer?.text && (
          <PortableText
            blocks={footer.text}
            className={clsx(
              'text-xs', //
              'text-sm text-darkGray',
            )}
          />
        )}
      </div>

      {/* Sanity Footer */}
      <SanityFooter />
    </footer>
  );
}
