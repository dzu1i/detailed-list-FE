type Props = {
  edit: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onDone: () => void;
  onArchive: () => void;
  onDelete: () => void;
};

export default function ActionButtons({
  edit,
  onEdit,
  onCancel,
  onDone,
  onArchive,
  onDelete,
}: Props) {
  if (edit) {
    // EDIT MODE — show Done / Cancel
    return (
      <div className="footer-actions">
        <button className="edit" onClick={onDone}>
          Done
        </button>
        <button className="archive" onClick={onCancel}>
          Cancel
        </button>
      </div>
    );
  }

  // NORMAL MODE — Edit / Archive / Delete
  return (
    <div className="footer-actions">
      <button className="edit" onClick={onEdit}>
        Edit
      </button>
      <button className="archive" onClick={onArchive}>
        Archive
      </button>
      <button className="delete" onClick={onDelete}>
        Delete
      </button>
    </div>
  );
}
