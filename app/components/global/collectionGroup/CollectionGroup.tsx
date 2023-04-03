import type {SanityCollectionGroup} from '~/types/sanity';

import CollectionGroupDialog from './CollectionGroupDialog';

type Props = {
  collectionGroup: SanityCollectionGroup;
};

export default function CollectionGroup({collectionGroup}: Props) {
  return (
    <CollectionGroupDialog
      collection={collectionGroup.collectionProducts}
      collectionGroup={collectionGroup}
    />
  );
}
