"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/types";

export function QuizBox({ quiz }: { quiz?: QuizQuestion }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!quiz) return null;

  return (
    <div className="mt-8 rounded-md bg-paper p-5">
      <h3 className="text-xl font-black text-ink">확인 문제</h3>
      <p className="mt-3 font-bold text-ink">{quiz.question}</p>
      <div className="mt-3 grid gap-2">
        {quiz.options.map((option, index) => {
          const isAnswer = submitted && index === quiz.answerIndex;
          const isWrong = submitted && selected === index && selected !== quiz.answerIndex;
          return (
            <button
              key={option}
              type="button"
              onClick={() => {
                if (!submitted) setSelected(index);
              }}
              className={`rounded-md border bg-panel p-3 text-left text-sm font-bold transition ${
                isAnswer
                  ? "border-forest text-forest"
                  : isWrong
                    ? "border-danger text-danger"
                    : selected === index
                      ? "border-marine text-ink"
                      : "border-line text-muted"
              }`}
            >
              {index + 1}. {option}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        disabled={selected == null || submitted}
        onClick={() => setSubmitted(true)}
        className="mt-4 rounded-md bg-ink px-4 py-2 text-sm font-black text-white disabled:cursor-not-allowed disabled:bg-muted"
      >
        답 제출
      </button>
      {submitted ? <p className="mt-3 text-sm leading-6 text-muted">{quiz.explanation}</p> : null}
    </div>
  );
}
