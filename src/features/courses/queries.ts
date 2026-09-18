"use client";

import { useQuery } from "@tanstack/react-query";
import {
  useQueryContext,
  useRoleMutation,
} from "@/features/auth/query-context";
import { env } from "@/lib/env";
import { getDemoUser } from "@/features/auth/demo-users";
import type { UserRole } from "@/features/auth/types";
import {
  extractCourseOutcomes,
  generateCourseAssessment,
  getAcademicDashboard,
  getCourse,
  getCourses,
  uploadCourseMaterial,
} from "@/features/courses/api";
import { queryKeys } from "@/lib/api/query-keys";
import type { AssessmentType } from "@/types/assessment";

function useAcademicDashboard(role: UserRole) {
  const context = useQueryContext(role);
  return useQuery({
    queryKey:
      role === "STUDENT"
        ? queryKeys.students.dashboard(context.userId)
        : queryKeys.professors.dashboard(context.userId),
    queryFn: ({ signal }) => getAcademicDashboard(role, signal),
    enabled: context.enabled,
  });
}
export function useStudentDashboard() {
  return useAcademicDashboard("STUDENT");
}
export function useProfessorDashboard() {
  return useAcademicDashboard("PROFESSOR");
}
export function useCourses(role: UserRole) {
  const context = useQueryContext(role);
  return useQuery({
    queryKey:
      role === "STUDENT"
        ? queryKeys.students.courses(context.userId)
        : queryKeys.professors.courses(context.userId),
    queryFn: ({ signal }) => getCourses(role, signal),
    enabled: context.enabled,
  });
}
export function useCourse(courseId: string, role: UserRole) {
  const context = useQueryContext(role);
  return useQuery({
    queryKey: queryKeys.courses.detail(role, context.userId, courseId),
    queryFn: ({ signal }) => getCourse(courseId, role, signal),
    enabled: context.enabled && !!courseId,
  });
}
function courseMutationKeys(professorId: string, courseId: string) {
  return [
    queryKeys.courses.detail("PROFESSOR", professorId, courseId),
    ...(env.useMocks
      ? [
          queryKeys.courses.detail(
            "STUDENT",
            getDemoUser("STUDENT").id,
            courseId,
          ),
          queryKeys.professors.courses(professorId),
          queryKeys.students.courses(getDemoUser("STUDENT").id),
        ]
      : []),
  ];
}
export function useUploadCourseMaterial(courseId: string) {
  return useRoleMutation(
    "PROFESSOR",
    (input: { title: string; content: string }) =>
      uploadCourseMaterial(courseId, input),
    (_data, _input, userId) => courseMutationKeys(userId, courseId),
  );
}
export function useExtractCourseOutcomes(courseId: string) {
  return useRoleMutation<
    Awaited<ReturnType<typeof extractCourseOutcomes>>,
    void
  >(
    "PROFESSOR",
    () => extractCourseOutcomes(courseId),
    (_data, _input, userId) => courseMutationKeys(userId, courseId),
  );
}
export function useGenerateCourseAssessment(courseId: string) {
  return useRoleMutation(
    "PROFESSOR",
    (type: AssessmentType) => generateCourseAssessment(courseId, type),
    (data, _input, userId) => [
      ...courseMutationKeys(userId, courseId),
      queryKeys.assessments.professorDetail(userId, data.id),
    ],
  );
}
