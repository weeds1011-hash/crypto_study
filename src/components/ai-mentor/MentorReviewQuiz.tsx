"use client";

import { useState } from "react";
import type { StudyCoachResult } from "@/features/ai-mentor/study-coach";

export function MentorReviewQuiz({ quiz, lessonSlug }: { quiz: StudyCoachResult["reviewQuiz"]; lessonSlug?: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function submit() {
    if (selected == null) return;
    setSubmitted(true);
    if (selected === quiz.answerIndex && lessonSlug) {
      markLessonComplete(lessonSlug);
    }
  }

  function retry() {
    setSelected(null);
    setSubmitted(false);
  }

  return (
    <section className="mt-5 rounded-md border border-line bg-panel p-4" aria-label="AI Mentor 복습 문제">
      <h3 className="font-black text-ink">복습 문제</h3>
      <p className="mt-2 text-sm font-bold text-muted">{quiz.question}</p>
      <div className="mt-3 grid gap-2">
        {quiz.options.map((option, index) => {
          const selectedClass = selected === index ? "border-marine bg-[#eef6ff] text-ink" : "border-line bg-paper text-muted";
          const resultClass = submitted && index === quiz.answerIndex ? "border-forest bg-[#edf8f0]" : selectedClass;
          return (
            <button
              key={option}
              type="button"
              onClick={() => setSelected(index)}
              className={`rounded-md border px-3 py-2 text-left text-sm font-bold focus:outline-none focus:ring-2 focus:ring-marine ${submitted ? resultClass : selectedClass}`}
              aria-pressed={selected === index}
            >
              {option}
            </button>
          );
        })}
      </div>
      {!submitted ? (
        <button type="button" onClick={submit} disabled={selected == null} className="mt-4 rounded-md bg-ink px-4 py-2 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-50">
          답 제출
        </button>
      ) : (
        <div className="mt-4 rounded-md border border-line bg-paper p-4">
          <p className="text-sm font-black text-ink">{selected === quiz.answerIndex ? "정답입니다." : "다시 확인해볼 문제입니다."}</p>
          <p className="mt-2 text-sm leading-6 text-muted">정답: {quiz.options[quiz.answerIndex]}</p>
          <p className="mt-2 text-sm leading-6 text-muted">해설: {quiz.explanation}</p>
          <button type="button" onClick={retry} className="mt-3 rounded-md border border-line bg-panel px-4 py-2 text-sm font-black text-ink">
            다시 풀기
          </button>
        </div>
      )}
    </section>
  );
}

function markLessonComplete(slug: string) {
  try {
    const key = "crypto-study:completed-lessons";
    const parsed = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    const completed = Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
    if (!completed.includes(slug)) {
      window.localStorage.setItem(key, JSON.stringify([...completed, slug]));
    }
  } catch {
    window.localStorage.setItem("crypto-study:completed-lessons", JSON.stringify([slug]));
  }
}
