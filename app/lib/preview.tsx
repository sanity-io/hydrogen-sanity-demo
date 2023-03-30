import {definePreview, type Params, PreviewSuspense} from '@sanity/preview-kit';
import {createContext, type ReactNode, useContext} from 'react';

const PreviewContext = createContext<PreviewContext | undefined>(undefined);

export const usePreviewContext = () => useContext(PreviewContext);

/**
 * Conditionally apply `PreviewSuspense` boundary
 * @see https://www.sanity.io/docs/preview-content-on-site
 */
export function Preview(props: PreviewProps) {
  const {children, preview} = props;

  if (!preview) {
    return <>{children}</>;
  }

  const fallback = props.fallback ?? <div>Loading preview...</div>;
  const {projectId, dataset, token} = preview;
  const _usePreview = definePreview({
    projectId,
    dataset,
    overlayDrafts: true,
  });

  function usePreview<
    R = any,
    P extends Params = Params,
    Q extends string = string,
  >(query: Q, params?: P, serverSnapshot?: R): R {
    return _usePreview(token, query, params, serverSnapshot);
  }
  usePreview satisfies UsePreview;

  return (
    <PreviewContext.Provider value={{usePreview}}>
      <PreviewSuspense fallback={fallback}>{children}</PreviewSuspense>
    </PreviewContext.Provider>
  );
}

type UsePreview = <
  R = any,
  P extends Params = Params,
  Q extends string = string,
>(
  query: Q,
  params?: P,
  serverSnapshot?: R,
) => R;

type PreviewData = {
  projectId: string;
  dataset: string;
  token: string;
};

type PreviewContext = {
  /**
   * Query Sanity and subscribe to changes, optionally
   * passing a server snapshot to speed up hydration
   */
  usePreview: UsePreview;
};

type PreviewProps = {
  children: ReactNode;
  fallback?: ReactNode;
  preview?: PreviewData;
};
