export type NoteTargetType = "lesson" | "daily-question";

export type UserNote = {
  id: string;
  targetType: NoteTargetType;
  targetId: string;
  body: string;
  updatedAt: string;
};

export type StorageLike = Pick<Storage, "getItem" | "setItem">;

const storageKey = "crypto-study:user-notes";

export function listNotes(storage: StorageLike, targetType: NoteTargetType, targetId: string): UserNote[] {
  return readAllNotes(storage)
    .filter((note) => note.targetType === targetType && note.targetId === targetId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function saveNote(storage: StorageLike, note: Omit<UserNote, "updatedAt">, now = new Date().toISOString()) {
  const notes = readAllNotes(storage);
  const nextNote: UserNote = { ...note, updatedAt: now };
  const nextNotes = notes.filter((item) => item.id !== note.id).concat(nextNote);
  storage.setItem(storageKey, JSON.stringify(nextNotes));
  return nextNote;
}

export function deleteNote(storage: StorageLike, id: string) {
  storage.setItem(storageKey, JSON.stringify(readAllNotes(storage).filter((note) => note.id !== id)));
}

export function readAllNotes(storage: StorageLike): UserNote[] {
  const raw = storage.getItem(storageKey);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isUserNote);
  } catch {
    return [];
  }
}

function isUserNote(value: unknown): value is UserNote {
  if (typeof value !== "object" || value == null) return false;
  const note = value as Partial<UserNote>;
  return typeof note.id === "string" && typeof note.targetType === "string" && typeof note.targetId === "string" && typeof note.body === "string" && typeof note.updatedAt === "string";
}
