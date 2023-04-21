import {definePreview, type Params, PreviewSuspense} from '@sanity/preview-kit';
import {
  createCookieSessionStorage,
  type Session,
  type SessionStorage,
} from '@shopify/remix-oxygen';
import {
  createContext,
  ElementType,
  type ReactNode,
  useContext,
  useMemo,
} from 'react';

export class PreviewSession {
  constructor(
    private sessionStorage: SessionStorage,
    private session: Session,
  ) {}

  static async init(request: Request, secrets: string[]) {
    const storage = createCookieSessionStorage({
      cookie: {
        name: '__preview',
        httpOnly: true,
        sameSite: true,
        secure: process.env.NODE_ENV === 'production',
        secrets,
      },
    });

    const session = await storage.getSession(request.headers.get('Cookie'));

    return new this(storage, session);
  }

  has(key: string) {
    return this.session.has(key);
  }

  // get(key: string) {
  //   return this.session.get(key);
  // }

  destroy() {
    return this.sessionStorage.destroySession(this.session);
  }

  // unset(key: string) {
  //   this.session.unset(key);
  // }

  set(key: string, value: any) {
    this.session.set(key, value);
  }

  commit() {
    return this.sessionStorage.commitSession(this.session);
  }
}

const PreviewContext = createContext<PreviewContext | undefined>(undefined);

export const usePreviewContext = () => useContext(PreviewContext);

/**
 * Conditionally apply `PreviewSuspense` boundary
 * @see https://www.sanity.io/docs/preview-content-on-site
 */
export function Preview(props: PreviewProps) {
  const {children, preview} = props;

  if (!preview?.token) {
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

export type PreviewData = {
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

export type PreviewProps = {
  children: ReactNode;
  fallback?: ReactNode;
  preview?: PreviewData;
};

/**
 * Select and memoize which component to render based on preview mode
 */
export function usePreviewComponent<T>(
  component: ElementType<T>,
  preview: ElementType<T>,
) {
  const isPreview = Boolean(usePreviewContext());

  return useMemo(
    () => (isPreview ? preview : component),
    [component, isPreview, preview],
  );
}
