"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/types";

function readList(key: string) {
  try {
    return JSON.parse(window.localStorage.getItem(key) ?? "[]") as string[];
  } catch {
    return [];
  }
}

function saveLessonComplete(lessonSlug: string) {
  const completedKey = "crypto-study-completed-lessons";
  const completed = Array.from(new Set([...readList(completedKey), lessonSlug]));
  window.localStorage.setItem(completedKey, JSON.stringify(completed));

  const today = new Date().toISOString().slice(0, 10);
  const todayKey = `crypto-study-completed-${today}`;
  const todayCompleted = Array.from(new Set([...readList(todayKey), lessonSlug]));
  window.localStorage.setItem(todayKey, JSON.stringify(todayCompleted));
  window.dispatchEvent(new Event("crypto-study-progress"));
}

export function QuizBox({ quiz, lessonSlug }: { quiz?: QuizQuestion; lessonSlug: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  if (!quiz) return null;
  const activeQuiz = quiz;

  function submitAnswer() {
    if (selected == null) return;
    const correct = selected === activeQuiz.answerIndex;
    setSubmitted(true);
    setIsCorrect(correct);
    window.localStorage.setItem(
      `crypto-study-quiz-${lessonSlug}`,
      JSON.stringify({ selected, correct, answeredAt: new Date().toISOString() }),
    );
    if (correct) saveLessonComplete(lessonSlug);
  }

  function retry() {
    setSelected(null);
    setSubmitted(false);
    setIsCorrect(false);
  }

  return (
    <div className="mt-8 rounded-md bg-paper p-5">
      <h3 className="text-xl font-black text-ink">퀴즈</h3>
      <p className="mt-3 font-bold text-ink">{activeQuiz.question}</p>
      <div className="mt-3 grid gap-2">
        {activeQuiz.options.map((option, index) => {
          const isAnswer = submitted && index === activeQuiz.answerIndex;
          const isWrong = submitted && selected === index && selected !== activeQuiz.answerIndex;
          return (
            <button
              key={option}
              type="button"
              onClick={() => {
                if (!submitted) setSelected(index);
              }}
              className={`rounded-md border bg-panel p-3 text-left text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-marine ${
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
        onClick={submitAnswer}
        className="mt-4 rounded-md bg-ink px-4 py-2 text-sm font-black text-white disabled:cursor-not-allowed disabled:bg-muted"
      >
        답 제출
      </button>
      {submitted ? (
        <div className="mt-3 rounded-md border border-line bg-panel p-4">
          <p className="text-sm font-black text-ink">{isCorrect ? "정답입니다. 수업 완료로 저장했어요." : "아쉽지만 다시 풀 수 있습니다."}</p>
          <p className="mt-2 text-sm leading-6 text-muted">{activeQuiz.explanation}</p>
          {!isCorrect ? (
            <button
              type="button"
              onClick={retry}
              className="mt-3 rounded-md border border-line px-3 py-2 text-sm font-black text-ink focus:outline-none focus:ring-2 focus:ring-marine"
            >
              다시 풀기
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
