import { courses, toLegacyLesson, universityLessons } from "@/content/courses/university";

export const lessonCategories = courses.map((course) => course.title);

export const lessons = universityLessons.map(toLegacyLesson);
