import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/ListDetail.css";
import ItemList, { Item } from "../components/ItemList";
import ListHeader from "../components/ListHeader";
import ActionButtons from "../components/ActionButtons";

export type Member = {
  id: string;
  name: string;
};

export type ShoppingList = {
  id: string;
  title: string;
  createdAt: string;
  ownerId: string;
  members: Member[];
  items: Item[];
};

const CURRENT_USER_ID = "u1";

// constant data (resets on refresh)
const LISTS: Record<string, ShoppingList> = {
  groceries: {
    id: "groceries",
    title: "Groceries",
    createdAt: "2025-11-01",
    ownerId: "u1",
    members: [
      { id: "u1", name: "Julie" },
      { id: "u2", name: "Alex" },
    ],
    items: [
      { id: "i1", name: "Chicken", qty: "500 g", done: true },
      { id: "i2", name: "Toilet paper", qty: "1 pack", done: true },
      { id: "i3", name: "Sour cream", qty: "1", done: true },
      { id: "i4", name: "Pasta", qty: "500 g", done: false },
      { id: "i5", name: "Garlic", qty: "1", done: false },
    ],
  },
};

export default function ListDetailPage() {
  const { listId } = useParams();
  const navigate = useNavigate();

  const base = LISTS[listId ?? "groceries"] ?? LISTS.groceries;

  const [list, setList] = useState<ShoppingList>(structuredClone(base));
  const [backup, setBackup] = useState<ShoppingList>(structuredClone(base)); // for Cancel
  const [edit, setEdit] = useState(false);
  const [filter, setFilter] = useState<"all" | "active">("all");

  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState("");
  const [newMemberName, setNewMemberName] = useState("");

  const isOwner = list.ownerId === CURRENT_USER_ID;
  const isMember = list.members.some((m) => m.id === CURRENT_USER_ID);

  const allDone = useMemo(() => list.items.every((i) => i.done), [list.items]);
  const dateStr = new Date(list.createdAt).toLocaleDateString("cs-CZ");

  const visibleItems = useMemo(
    () => (filter === "all" ? list.items : list.items.filter((i) => !i.done)),
    [list.items, filter]
  );

  const toggleItem = (id: string) =>
    setList((prev) => ({
      ...prev,
      items: prev.items.map((i) => (i.id === id ? { ...i, done: !i.done } : i)),
    }));

  const changeItem = (id: string, patch: Partial<Item>) =>
    setList((prev) => ({
      ...prev,
      items: prev.items.map((i) => (i.id === id ? { ...i, ...patch } : i)),
    }));

  const toggleAll = () =>
    setList((prev) => ({
      ...prev,
      items: prev.items.map((i) => ({ ...i, done: !allDone })),
    }));

  const handleTitleChange = (value: string) => {
    if (!isOwner) return;
    setList((prev) => ({ ...prev, title: value }));
  };

  // ---- Edit / Done / Cancel ----
  const handleEdit = () => {
    setBackup(structuredClone(list));
    setEdit(true);
  };

  const handleDone = () => {
    setEdit(false); // list already contains edits
  };

  const handleCancel = () => {
    setList(structuredClone(backup));
    setEdit(false);
  };

  // ---- Items: add / remove ----
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) return;
    if (!newItemName.trim()) return;

    const newItem: Item = {
      id: "i" + Date.now(),
      name: newItemName.trim(),
      qty: newItemQty.trim() || "1",
      done: false,
    };

    setList((prev) => ({ ...prev, items: [...prev.items, newItem] }));
    setNewItemName("");
    setNewItemQty("");
  };

  const handleRemoveItem = (id: string) => {
    if (!isOwner) return;
    setList((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.id !== id),
    }));
  };

  // ---- Members: add / remove / leave ----
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) return;
    if (!newMemberName.trim()) return;

    const newMember: Member = {
      id: "u" + Date.now(),
      name: newMemberName.trim(),
    };

    setList((prev) => ({ ...prev, members: [...prev.members, newMember] }));
    setNewMemberName("");
  };

  const handleRemoveMember = (id: string) => {
    if (!isOwner) return;
    if (id === list.ownerId) return; // cannot remove owner
    setList((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== id),
    }));
  };

  const handleLeaveList = () => {
    if (!isMember || isOwner) return;
    if (!window.confirm("Leave this shopping list?")) return;

    setList((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== CURRENT_USER_ID),
    }));
    navigate("/");
  };

  // ---- Archive / delete ----
  const handleDelete = () => {
    if (window.confirm("Delete this list? (demo)")) navigate("/");
  };

  const handleArchive = () => {
    alert("Archived (demo). Data se po reloadu vrátí.");
    navigate("/");
  };

  const roleLabel = isOwner
    ? "You are owner"
    : isMember
    ? "You are member"
    : "Viewer";

  return (
    <div className="detail-page">
      <div className="detail-card">
        <ListHeader
          title={list.title}
          dateStr={dateStr}
          allDone={allDone}
          onToggleAll={toggleAll}
          edit={edit}
          isOwner={isOwner}
          onTitleChange={handleTitleChange}
        />

        <div className="detail-panel">
          {/* members + role */}
          <div className="members-box">
            <div className="members-header">
              <span>Members</span>
              <span className="role-badge">{roleLabel}</span>
            </div>

            <div className="members-list">
              {list.members.map((m) => (
                <div key={m.id} className="member-pill">
                  <span>
                    {m.name}
                    {m.id === list.ownerId ? " (owner)" : ""}
                  </span>
                  {edit && isOwner && m.id !== list.ownerId && (
                    <button
                      className="member-remove"
                      onClick={() => handleRemoveMember(m.id)}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* add member ONLY IN EDIT + owner */}
            {edit && isOwner && (
              <form className="members-add" onSubmit={handleAddMember}>
                <input
                  placeholder="New member name"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                />
                <button type="submit">Add</button>
              </form>
            )}

            {/* leave list – available in both modes for member (non-owner) */}
            {!isOwner && isMember && (
              <button className="leave-btn" onClick={handleLeaveList}>
                Leave list
              </button>
            )}
          </div>

          {/* filter: ONLY in normal view (not edit) */}
          {!edit && (
            <div className="filter-row">
              <span>Items:</span>
              <div className="filter-buttons">
                <button
                  type="button"
                  className={filter === "active" ? "active" : ""}
                  onClick={() => setFilter("active")}
                >
                  Active only
                </button>
                <button
                  type="button"
                  className={filter === "all" ? "active" : ""}
                  onClick={() => setFilter("all")}
                >
                  All items
                </button>
              </div>
            </div>
          )}

          {/* add item (owner + edit) */}
          {isOwner && edit && (
            <form className="add-item-row" onSubmit={handleAddItem}>
              <input
                placeholder="Item name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
              />
              <input
                placeholder="Amount"
                value={newItemQty}
                onChange={(e) => setNewItemQty(e.target.value)}
              />
              <button type="submit">Add</button>
            </form>
          )}

          {/* items */}
          <ItemList
            items={visibleItems}
            edit={edit}
            isOwner={isOwner}
            onToggle={toggleItem}
            onChange={changeItem}
            onRemove={handleRemoveItem}
          />

          <ActionButtons
            edit={edit}
            onEdit={handleEdit}
            onDone={handleDone}
            onCancel={handleCancel}
            onArchive={handleArchive}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
