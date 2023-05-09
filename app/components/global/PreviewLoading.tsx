import SpinnerIcon from '../icons/Spinner';

export function PreviewLoading() {
  return (
    <div className="max-w-screen flex min-h-screen flex-col items-center">
      <main
        className="font-semibold leading-6 relative inline-flex grow items-center gap-2 px-4 py-2 text-sm"
        role="main"
      >
        <SpinnerIcon width="27" height="27" />
        <span>Loading preview...</span>
      </main>
    </div>
  );
}
