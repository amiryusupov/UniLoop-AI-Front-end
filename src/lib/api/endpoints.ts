import type { HttpMethod } from "@/types/api";
const segment = (id: string) => encodeURIComponent(id);
function endpoint<N extends string>(
  name: N,
  method: HttpMethod,
  path: string,
  params: Record<string, string> = {},
) {
  return { name, method, path, params };
}
export const endpoints = {
  studentDashboard: () =>
    endpoint("studentDashboard", "GET", "/students/me/dashboard"),
  professorDashboard: () =>
    endpoint("professorDashboard", "GET", "/professors/me/dashboard"),
  studentCourses: () =>
    endpoint("studentCourses", "GET", "/students/me/courses"),
  professorCourses: () =>
    endpoint("professorCourses", "GET", "/professors/me/courses"),
  courseDetail: (courseId: string) =>
    endpoint("courseDetail", "GET", `/courses/${segment(courseId)}`, {
      courseId,
    }),
  courseMaterials: (courseId: string) =>
    endpoint(
      "courseMaterials",
      "POST",
      `/courses/${segment(courseId)}/materials`,
      { courseId },
    ),
  extractOutcomes: (courseId: string) =>
    endpoint(
      "extractOutcomes",
      "POST",
      `/courses/${segment(courseId)}/outcomes/extract`,
      { courseId },
    ),
  generateAssessment: (courseId: string) =>
    endpoint(
      "generateAssessment",
      "POST",
      `/courses/${segment(courseId)}/assessments/generate`,
      { courseId },
    ),
  assessment: (assessmentId: string) =>
    endpoint("assessment", "GET", `/assessments/${segment(assessmentId)}`, {
      assessmentId,
    }),
  submitAssessment: (assessmentId: string) =>
    endpoint(
      "submitAssessment",
      "POST",
      `/assessments/${segment(assessmentId)}/submissions`,
      { assessmentId },
    ),
  mastery: (courseId: string) =>
    endpoint("mastery", "GET", `/students/me/mastery/${segment(courseId)}`, {
      courseId,
    }),
  learningPlan: (courseId: string) =>
    endpoint(
      "learningPlan",
      "GET",
      `/students/me/learning-plans/${segment(courseId)}`,
      { courseId },
    ),
  generateLearningPlan: (courseId: string) =>
    endpoint(
      "generateLearningPlan",
      "POST",
      `/students/me/learning-plans/${segment(courseId)}`,
      { courseId },
    ),
  insights: (courseId: string) =>
    endpoint(
      "insights",
      "GET",
      `/professors/me/courses/${segment(courseId)}/insights`,
      { courseId },
    ),
  interventions: (courseId: string) =>
    endpoint(
      "interventions",
      "GET",
      `/professors/me/courses/${segment(courseId)}/interventions`,
      { courseId },
    ),
  suggestInterventions: (courseId: string) =>
    endpoint(
      "suggestInterventions",
      "POST",
      `/professors/me/courses/${segment(courseId)}/interventions`,
      { courseId },
    ),
  decideIntervention: (courseId: string, interventionId: string) =>
    endpoint(
      "decideIntervention",
      "PATCH",
      `/professors/me/courses/${segment(courseId)}/interventions/${segment(interventionId)}`,
      { courseId, interventionId },
    ),
  professorGrowthPlan: () =>
    endpoint("professorGrowthPlan", "POST", "/professors/me/growth-plans"),
  opportunityDashboard: () =>
    endpoint(
      "opportunityDashboard",
      "GET",
      "/students/me/opportunity-dashboard",
    ),
  careerProfile: () =>
    endpoint("careerProfile", "PATCH", "/students/me/career-profile"),
  recommendations: () =>
    endpoint("recommendations", "GET", "/students/me/recommendations"),
  updateRecommendation: (recommendationId: string) =>
    endpoint(
      "updateRecommendation",
      "PATCH",
      `/students/me/recommendations/${segment(recommendationId)}`,
      { recommendationId },
    ),
  requestEndorsement: () =>
    endpoint("requestEndorsement", "POST", "/students/me/endorsement-requests"),
  referralCandidates: () =>
    endpoint("referralCandidates", "GET", "/professors/me/referral-candidates"),
  studentEvidence: (studentId: string) =>
    endpoint(
      "studentEvidence",
      "GET",
      `/professors/me/students/${segment(studentId)}/evidence`,
      { studentId },
    ),
  decideEndorsement: () =>
    endpoint("decideEndorsement", "POST", "/professors/me/endorsements"),
  surveys: () => endpoint("surveys", "GET", "/surveys"),
};
export type ApiEndpoint = ReturnType<
  (typeof endpoints)[keyof typeof endpoints]
>;
