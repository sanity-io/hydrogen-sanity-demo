import {useFetcher, useLocation} from '@remix-run/react';
import clsx from 'clsx';

export default function PreviewExit() {
  const url = useLocation();
  const fetcher = useFetcher();

  return (
    <fetcher.Form action={`/api/preview`} method="post">
      <input type="hidden" name="slug" value={url.pathname} />
      <button
        disabled={fetcher.state === 'submitting'}
        className={clsx(
          'fixed bottom-4 left-4 z-10 ml-auto rounded bg-emerald-600 px-4 py-6 text-left text-white shadow transition delay-150 duration-300 ease-in-out',
          'hover:-translate-y-1 hover:scale-110 hover:bg-emerald-700',
        )}
      >
        <>
          <div className={clsx('mb-1 text-lg font-bold uppercase')}>
            Preview Mode
          </div>
          <div>Click to exit</div>
        </>
      </button>
    </fetcher.Form>
  );
}
