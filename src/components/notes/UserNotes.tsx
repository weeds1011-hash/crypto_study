"use client";

import { useEffect, useState } from "react";
import { deleteNote, listNotes, saveNote, type NoteTargetType, type UserNote } from "./notes-storage";

export function UserNotes({ targetType, targetId }: { targetType: NoteTargetType; targetId: string }) {
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [body, setBody] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setNotes(listNotes(window.localStorage, targetType, targetId));
  }, [targetType, targetId]);

  function refresh() {
    setNotes(listNotes(window.localStorage, targetType, targetId));
  }

  function submitNote() {
    const trimmed = body.trim();
    if (!trimmed) return;
    saveNote(window.localStorage, {
      id: editingId ?? crypto.randomUUID(),
      targetType,
      targetId,
      body: trimmed,
    });
    setBody("");
    setEditingId(null);
    refresh();
  }

  return (
    <section className="rounded-lg border border-line bg-panel p-5 shadow-sm" aria-label="내 학습 노트">
      <p className="text-xs font-black uppercase text-forest">My Notes</p>
      <h2 className="mt-1 text-2xl font-black text-ink">내 노트</h2>
      <div className="mt-4 grid gap-3">
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={4}
          className="w-full rounded-md border border-line bg-paper p-3 text-sm leading-6 text-ink focus:outline-none focus:ring-2 focus:ring-marine"
          placeholder="배운 점, 헷갈리는 점, 나중에 확인할 질문을 적어두세요."
        />
        <button
          type="button"
          onClick={submitNote}
          className="inline-flex w-fit items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-black text-white focus:outline-none focus:ring-2 focus:ring-marine"
        >
          {editingId ? "노트 수정" : "노트 저장"}
        </button>
      </div>
      <div className="mt-5 grid gap-3">
        {notes.length === 0 ? (
          <p className="rounded-md bg-paper p-4 text-sm leading-6 text-muted">아직 저장한 노트가 없습니다.</p>
        ) : (
          notes.map((note) => (
            <article key={note.id} className="rounded-md border border-line bg-paper p-4">
              <p className="whitespace-pre-wrap text-sm leading-6 text-muted">{note.body}</p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-muted">수정: {new Date(note.updatedAt).toLocaleString("ko-KR")}</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(note.id);
                      setBody(note.body);
                    }}
                    className="rounded-md border border-line bg-panel p-2 text-ink focus:outline-none focus:ring-2 focus:ring-marine"
                    aria-label="노트 수정"
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      deleteNote(window.localStorage, note.id);
                      refresh();
                    }}
                    className="rounded-md border border-line bg-panel p-2 text-danger focus:outline-none focus:ring-2 focus:ring-marine"
                    aria-label="노트 삭제"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
