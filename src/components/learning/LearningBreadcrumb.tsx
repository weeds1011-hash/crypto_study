import Link from "next/link";
import type { Course } from "@/content/courses/university";

export function LearningBreadcrumb({ course, moduleTitle, lessonTitle }: { course?: Course; moduleTitle?: string; lessonTitle: string }) {
  return (
    <nav aria-label="학습 위치" className="flex flex-wrap items-center gap-2 text-sm font-bold text-muted">
      <Link href="/learn" className="text-marine focus:outline-none focus:ring-2 focus:ring-marine">
        Crypto University
      </Link>
      <span aria-hidden="true">/</span>
      <span>{course?.title ?? "Course"}</span>
      <span aria-hidden="true">/</span>
      <span>{moduleTitle ?? "Module"}</span>
      <span aria-hidden="true">/</span>
      <span className="text-ink">{lessonTitle}</span>
    </nav>
  );
}
