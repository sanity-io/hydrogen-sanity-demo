import {useFetcher, useLocation} from '@remix-run/react';
import clsx from 'clsx';

export function PreviewBanner() {
  const url = useLocation();
  const fetcher = useFetcher();

  return (
    <fetcher.Form
      action={`/api/preview`}
      method="post"
      className={clsx(
        'sticky bottom-0 z-40 flex items-center justify-center gap-4 px-4 py-2',
        'bg-offBlack text-white',
        'md:px-8',
      )}
    >
      <input type="hidden" name="slug" value={url.pathname} />
      <small className="italic opacity-80">
        While preview mode is enabled, any changes made in the Studio will be
        streamed to your browser.
      </small>
      <button
        disabled={fetcher.state === 'submitting'}
        className={clsx(
          'flex h-[2.5rem] shrink-0 items-center justify-center rounded-full border border-white border-opacity-20 bg-offBlack p-4 text-sm font-bold duration-200 ease-out',
          'hover:bg-black',
          'disabled:bg-opacity-100 disabled:opacity-20',
        )}
      >
        Exit Preview Mode
      </button>
    </fetcher.Form>
  );
}
