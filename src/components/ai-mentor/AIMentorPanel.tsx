"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { MentorAnswer } from "@/features/ai-mentor/answer";
import { buildMentorAnswer } from "@/features/ai-mentor/answer";
import { buildFlowDiagram } from "@/features/ai-mentor/diagram";
import { createRetrievalContext, retrieveFromApp } from "@/features/ai-mentor/retrieval";
import { buildStudyCoach } from "@/features/ai-mentor/study-coach";
import { MentorDiagramView } from "./MentorDiagramView";
import { MentorReviewQuiz } from "./MentorReviewQuiz";
import type { NormalizedNewsItem } from "@/server/providers/types";
import type { MetricSnapshot } from "@/types";

const recentKey = "crypto-study:mentor-recent-questions";
const completedKey = "crypto-study:completed-lessons";

const suggestions = [
  "스테이블코인 공급이 왜 중요해?",
  "비트코인 도미넌스와 알트코인은 어떻게 연결돼?",
  "TVL이 늘면 어떤 점을 조심해야 해?",
  "금리와 달러는 BTC 흐름과 어떤 경로로 연결돼?",
];

export function AIMentorPanel({ metrics, news }: { metrics: MetricSnapshot[]; news: NormalizedNewsItem[] }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<MentorAnswer | null>(null);
  const [recentQuestions, setRecentQuestions] = useState<string[]>(() => readRecentQuestions());
  const retrievalContext = useMemo(() => createRetrievalContext(metrics, news), [metrics, news]);
  const completed = useMemo(() => readCompletedLessons(), []);
  const coach = useMemo(() => buildStudyCoach(completed), [completed]);

  function ask(nextQuestion = question) {
    const trimmed = nextQuestion.trim();
    if (!trimmed) return;
    const retrieved = retrieveFromApp(trimmed, retrievalContext);
    const nextAnswer = buildMentorAnswer(trimmed, retrieved);
    const nextRecent = [trimmed, ...recentQuestions.filter((item) => item !== trimmed)].slice(0, 5);
    window.localStorage.setItem(recentKey, JSON.stringify(nextRecent));
    setRecentQuestions(nextRecent);
    setQuestion(trimmed);
    setAnswer(nextAnswer);
  }

  const diagram = answer ? buildFlowDiagram(retrieveFromApp(answer.question, retrievalContext)) : null;

  return (
    <section className="rounded-lg border border-line bg-panel p-5 shadow-calm" aria-label="AI Crypto Mentor 질문 패널">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase text-forest">AI Crypto Mentor</p>
          <h2 className="mt-2 text-3xl font-black text-ink">앱 데이터로만 답하는 학습 도우미</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
            LLM이 직접 사실을 만들지 않도록, 현재 앱의 시장 데이터·뉴스·학습 콘텐츠·지식 그래프에서 검색한 내용만 구조화해 답합니다.
          </p>
        </div>
        {coach.nextLesson ? (
          <Link href={coach.nextLesson.href} className="rounded-md bg-ink px-4 py-2 text-sm font-black text-white">
            다음 추천: {coach.nextLesson.title}
          </Link>
        ) : null}
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto]">
        <label className="grid gap-2">
          <span className="text-sm font-black text-ink">질문</span>
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") ask();
            }}
            className="rounded-md border border-line bg-paper px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-marine"
            placeholder="예: TVL이 늘면 좋은 신호야?"
          />
        </label>
        <button type="button" onClick={() => ask()} className="self-end rounded-md bg-ink px-5 py-3 text-sm font-black text-white">
          질문하기
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {suggestions.map((item) => (
          <button key={item} type="button" onClick={() => ask(item)} className="rounded-md border border-line bg-paper px-3 py-2 text-sm font-black text-muted">
            {item}
          </button>
        ))}
      </div>

      {recentQuestions.length > 0 ? (
        <div className="mt-4">
          <p className="text-sm font-black text-ink">최근 질문</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {recentQuestions.map((item) => (
              <button key={item} type="button" onClick={() => ask(item)} className="rounded-md bg-[#eef6ff] px-3 py-2 text-sm font-bold text-marine">
                {item}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {answer ? (
        <article className="mt-6 rounded-md border border-line bg-paper p-5">
          <AnswerSection title="질문" items={[answer.question]} />
          <AnswerSection title="3줄 요약" items={answer.summary} ordered />
          <AnswerSection title="근거 데이터" items={answer.evidenceData} />
          <AnswerSection title="관련 뉴스" items={answer.relatedNews} />
          <section className="mt-5">
            <h3 className="font-black text-ink">관련 학습</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {answer.relatedLessons.length > 0 ? (
                answer.relatedLessons.map((lesson) => (
                  <Link key={lesson.href} href={lesson.href} className="rounded-md bg-ink px-3 py-2 text-sm font-black text-white">
                    {lesson.title}
                  </Link>
                ))
              ) : (
                <p className="text-sm leading-6 text-muted">연결된 수업이 부족합니다.</p>
              )}
            </div>
          </section>
          <AnswerSection title="용어 설명" items={answer.glossary} />
          <AnswerSection title="주의사항" items={answer.cautions} />
          {diagram ? (
            <section className="mt-5 rounded-md border border-line bg-panel p-4">
              <h3 className="font-black text-ink">{diagram.title}</h3>
              <MentorDiagramView diagram={diagram} />
            </section>
          ) : null}
          <MentorReviewQuiz quiz={coach.reviewQuiz} lessonSlug={coach.reviewLessonSlug} />
        </article>
      ) : null}
    </section>
  );
}

function AnswerSection({ title, items, ordered = false }: { title: string; items: string[]; ordered?: boolean }) {
  const List = ordered ? "ol" : "ul";
  return (
    <section className="mt-5 first:mt-0">
      <h3 className="font-black text-ink">{title}</h3>
      <List className="mt-2 space-y-2 text-sm leading-6 text-muted">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </List>
    </section>
  );
}

function readRecentQuestions() {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(recentKey) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string").slice(0, 5) : [];
  } catch {
    return [];
  }
}

function readCompletedLessons() {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(completedKey) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}
