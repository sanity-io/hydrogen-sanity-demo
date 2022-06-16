import clsx from 'clsx';
import LogoIcon from '../icons/Logo';

/**
 * A shared component and Suspense call that's used in `App.server.jsx` to let your app wait for code to load while declaring a loading state
 */
export default function LoadingFallback() {
  return (
    <header
      className={clsx(
        'align-center fixed top-0 z-40 flex h-header-sm w-full justify-between px-8',
        'lg:h-header-lg',
      )}
      role="banner"
    >
      <div
        className={clsx(
          'absolute bottom-0 top-0 left-1/2 flex w-[50px] -translate-x-1/2 items-center',
          'lg:w-[65px]',
        )}
      >
        <LogoIcon className="h-auto w-full" />
      </div>
    </header>
  );
}
