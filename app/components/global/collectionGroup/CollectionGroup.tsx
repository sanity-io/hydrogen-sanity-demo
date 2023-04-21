import CollectionGroupDialog from '~/components/global/collectionGroup/CollectionGroupDialog';
import type {SanityCollectionGroup} from '~/lib/sanity';

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
