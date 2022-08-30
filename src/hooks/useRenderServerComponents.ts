import {useServerProps} from '@shopify/hydrogen';
import {useCallback} from 'react';

/**
 * This is a hack until we have better built-in primitives for
 * causing server components to re-render.
 *
 * @returns function when called will cause the current page to re-render on the server
 */
export default function useRenderServerComponents() {
  const {serverProps, setServerProps} = useServerProps();

  return useCallback(() => {
    setServerProps('renderRsc', !serverProps.renderRsc);
  }, [serverProps, setServerProps]);
}
