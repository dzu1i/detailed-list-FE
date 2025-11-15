import ItemRow, { Item } from "./ItemRow";

type Props = {
  items: Item[];
  edit: boolean;
  isOwner: boolean;
  onToggle: (id: string) => void;
  onChange: (id: string, patch: Partial<Item>) => void;
  onRemove: (id: string) => void;
};

export default function ItemList({
  items,
  edit,
  isOwner,
  onToggle,
  onChange,
  onRemove,
}: Props) {
  return (
    <div>
      {items.map((it) => (
        <ItemRow
          key={it.id}
          item={it}
          edit={edit}
          isOwner={isOwner}
          onToggle={onToggle}
          onChange={onChange}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}

export type { Item };
