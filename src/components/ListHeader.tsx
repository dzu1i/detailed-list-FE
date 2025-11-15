type Props = {
  title: string;
  dateStr: string;
  allDone: boolean;
  onToggleAll: () => void;
  edit: boolean;
  isOwner: boolean;
  onTitleChange: (value: string) => void;
};

export default function ListHeader({
  title,
  dateStr,
  allDone,
  onToggleAll,
  edit,
  isOwner,
  onTitleChange,
}: Props) {
  return (
    <header className="header">
      <button
        className={`icon-btn ${allDone ? "icon-done" : "icon-idle"}`}
        onClick={onToggleAll}
        aria-label="Mark all done/undone"
        title="Toggle all"
      >
        ✓
      </button>

      <div>
        {edit && isOwner ? (
          <input
            className="title-input"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
          />
        ) : (
          <h1 className="title">{title}</h1>
        )}
        <div className="date">{dateStr}</div>
      </div>
    </header>
  );
}
