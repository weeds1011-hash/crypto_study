import { LearningRoadmap } from "@/components/learning/LearningRoadmap";
import { LessonRail } from "@/components/learning/LessonRail";
import { lessons } from "@/content/lessons/seed";

export default function LearnPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <section className="mb-8">
        <p className="text-xs font-black uppercase text-forest">Learning</p>
        <h2 className="mt-2 text-4xl font-black text-ink">암호화폐 학습 시스템</h2>
        <p className="mt-4 max-w-3xl leading-7 text-muted">
          돈과 화폐부터 온체인 위험까지 순서대로 배우고, 퀴즈 결과와 수업 완료율을 브라우저에 저장합니다.
        </p>
      </section>
      <div className="space-y-8">
        <LearningRoadmap lessons={lessons} />
        <section>
          <div className="mb-4">
            <p className="text-xs font-black uppercase text-forest">Today Lessons</p>
            <h2 className="text-3xl font-black text-ink">질문으로 시작하는 수업</h2>
          </div>
          <LessonRail />
        </section>
      </div>
    </main>
  );
}
