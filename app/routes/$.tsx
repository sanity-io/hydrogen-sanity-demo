import {notFound} from '~/lib/utils';

export async function loader() {
  throw notFound();
}
export default function Component() {
  return null;
}
