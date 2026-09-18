"use client";

import { PageContainer } from "@/components/shared/page-container";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { StudentCourseCard } from "@/features/courses/components/student-course-card";
import { useCourses } from "@/features/courses/queries";
import { t } from "@/i18n";

export function StudentCourseList() {
  const courses = useCourses("STUDENT");
  if (courses.isLoading)
    return (
      <PageContainer className="py-8">
        <LoadingState />
      </PageContainer>
    );
  if (courses.isError)
    return (
      <PageContainer className="py-8">
        <ErrorState retry={() => void courses.refetch()} />
      </PageContainer>
    );
  if (!courses.data?.length)
    return (
      <PageContainer className="py-8">
        <EmptyState />
      </PageContainer>
    );
  return (
    <PageContainer className="py-8 sm:py-10">
      <header className="mb-7">
        <p className="text-sm font-medium text-primary">
          {t("academicOverview")}
        </p>
        <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight">
          {t("navCourses")}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {t("studentCoursesDescription")}
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {courses.data.map((course) => (
          <StudentCourseCard course={course} key={course.id} />
        ))}
      </div>
    </PageContainer>
  );
}
