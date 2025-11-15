import "./ItemRow.css";

export type Item = { id: string; name: string; qty: string; done: boolean };

type Props = {
  item: Item;
  edit: boolean;
  isOwner: boolean;
  onToggle: (id: string) => void;
  onChange: (id: string, patch: Partial<Item>) => void;
  onRemove: (id: string) => void;
};

export default function ItemRow({
  item,
  edit,
  isOwner,
  onToggle,
  onChange,
  onRemove,
}: Props) {
  const { id, name, qty, done } = item;

  return (
    <div className={`row ${done ? "done" : ""}`}>
      <label className="check">
        <input type="checkbox" checked={done} onChange={() => onToggle(id)} />
        <span />
      </label>

      {edit ? (
        <>
          <input
            className="name"
            value={name}
            onChange={(e) => onChange(id, { name: e.target.value })}
          />
          <input
            className="qty"
            value={qty}
            onChange={(e) => onChange(id, { qty: e.target.value })}
          />
        </>
      ) : (
        <>
          <div className="name">{name}</div>
          <div className="pill amount">{qty}</div>
        </>
      )}

      {edit && isOwner && (
        <button
          className="remove-btn"
          onClick={() => onRemove(id)}
          aria-label="Remove item"
        >
          ×
        </button>
      )}
    </div>
  );
}
