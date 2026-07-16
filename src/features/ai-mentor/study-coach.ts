import { lessons } from "@/content/lessons/seed";

export interface StudyCoachResult {
  nextLesson?: { title: string; href: string; reason: string };
  reviewQuiz: {
    question: string;
    options: string[];
    answerIndex: number;
    explanation: string;
  };
}

export function buildStudyCoach(completedSlugs: string[]): StudyCoachResult {
  const next = lessons.find((lesson) => !completedSlugs.includes(lesson.slug) && lesson.prerequisites.every((slug) => completedSlugs.includes(slug))) ?? lessons.find((lesson) => !completedSlugs.includes(lesson.slug));
  const review = lessons.find((lesson) => completedSlugs.includes(lesson.slug)) ?? lessons[0];

  return {
    nextLesson: next
      ? {
          title: next.title,
          href: `/learn/${next.slug}`,
          reason: next.prerequisites.length > 0 ? "선수 학습을 바탕으로 이어서 보기 좋은 수업입니다." : "기초 개념을 다지는 시작 수업입니다.",
        }
      : undefined,
    reviewQuiz: review.quiz[0],
  };
}
