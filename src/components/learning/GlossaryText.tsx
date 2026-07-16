"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { GlossaryTerm } from "@/types";

export function GlossaryText({ text, terms }: { text: string; terms: GlossaryTerm[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const parts = useMemo(() => splitText(text, terms), [terms, text]);

  return (
    <p className="mt-3 leading-7 text-muted">
      {parts.map((part, index) => {
        if (!part.term) return <span key={`${part.text}-${index}`}>{part.text}</span>;
        const isOpen = openId === part.term.id;
        return (
          <span key={`${part.text}-${index}`} className="relative inline-block">
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : part.term?.id ?? null)}
              className="rounded-sm font-black text-marine underline decoration-dotted underline-offset-4 focus:outline-none focus:ring-2 focus:ring-marine"
              aria-expanded={isOpen}
            >
              {part.text}
            </button>
            {isOpen ? (
              <span className="absolute left-0 top-7 z-20 w-72 rounded-md border border-line bg-panel p-3 text-left text-sm leading-6 text-muted shadow-calm">
                <strong className="block text-ink">{part.term.term}</strong>
                {part.term.oneLineDefinition}
                <Link href={`/glossary/${part.term.id}`} className="mt-2 block font-black text-marine">
                  용어사전에서 보기
                </Link>
              </span>
            ) : null}
          </span>
        );
      })}
    </p>
  );
}

function splitText(text: string, terms: GlossaryTerm[]) {
  const sorted = terms.filter((term) => text.includes(term.term)).sort((a, b) => b.term.length - a.term.length);
  const result: Array<{ text: string; term?: GlossaryTerm }> = [];
  let cursor = 0;

  while (cursor < text.length) {
    const found = sorted
      .map((term) => ({ term, index: text.indexOf(term.term, cursor) }))
      .filter((item) => item.index >= 0)
      .sort((a, b) => a.index - b.index)[0];

    if (!found) {
      result.push({ text: text.slice(cursor) });
      break;
    }

    if (found.index > cursor) result.push({ text: text.slice(cursor, found.index) });
    result.push({ text: found.term.term, term: found.term });
    cursor = found.index + found.term.term.length;
  }

  return result;
}
