# Frontend API contract — Phase 3

These are frontend integration proposals, not finalized NestJS facts. Planned paths come from the product brief; all request/response shapes below still require backend confirmation.

## Boundaries and configuration

Components consume feature hooks. Hooks call `src/features/*/api.ts` services. Services use `endpoints.ts`, a single transport selected in `getApiClient()`, Zod contracts, and feature adapters. UI must never import fixtures, build endpoint paths, call `fetch`, or unpack DTOs.

- `NEXT_PUBLIC_USE_MOCKS=true`: in-process mock transport, no server/API calls.
- `NEXT_PUBLIC_USE_MOCKS=false`: HTTP transport; base defaults to `http://localhost:5001/api/v1`.
- `NEXT_PUBLIC_MOCK_SCENARIO=populated|empty|error`, default `populated`.
- No data hooks are mounted by the Phase 2 scaffold screens yet.
- UserRole remains defined once in `features/auth/types.ts`.
- `getApiClient()` retains one mock database/client in a browser session. Server callers get isolated clients and should inject a client into a sequence of services when they need shared mock state.

## Authentication assumption

Phase 2 uses a persisted demo role; it is not server authentication. Mock requests take role metadata and resolve exactly the central demo users. HTTP ignores that metadata and expects future bearer authentication to resolve `me`.

`createHttpTransport({ baseUrl, getAccessToken, onUnauthorized })` exposes token injection and replaceable 401 behavior without importing Zustand. Neither token injection nor token refresh is wired in Phase 3. Phase 8 must replace demo query identity and session state with the backend-authenticated user. Production authorization, grading, consent enforcement, and professor ownership checks must run on the backend.

## Planned endpoints implemented by services and mock handlers

All paths below are relative to the API base. Responses have a provisional `{ data: ... }` envelope. Lists are currently unpaginated.

| Method | Path | Request | Response data |
| --- | --- | --- | --- |
| GET | /courses/:id | — | Course detail DTO |
| POST | /courses/:id/materials | `{ title, content }` | CourseMaterial |
| POST | /courses/:id/outcomes/extract | — | LearningOutcome[] |
| POST | /courses/:id/assessments/generate | `{ type }` | Safe assessment DTO |
| POST | /assessments/:id/submissions | `{ answers }` | SubmissionResult |
| GET | /students/me/mastery/:courseId | — | MasterySummary |
| POST | /students/me/learning-plans/:courseId | — | LearningPlan |
| GET | /professors/me/courses/:courseId/insights | — | ClassInsight |
| POST | /professors/me/courses/:courseId/interventions | — | TeachingIntervention[] |
| POST | /professors/me/growth-plans | — | ProfessorGrowthPlan |
| GET | /students/me/opportunity-dashboard | — | OpportunityDashboard |
| PATCH | /students/me/career-profile | CareerProfileUpdate | CareerProfile |
| GET | /students/me/recommendations | — | Recommendation[] |
| PATCH | /students/me/recommendations/:recommendationId | `{ status }` | Recommendation |
| POST | /students/me/endorsement-requests | EndorsementRequestInput | EndorsementRequest |
| GET | /professors/me/referral-candidates | — | ReferralCandidate[] |
| GET | /professors/me/students/:studentId/evidence | — | StudentEvidence |
| POST | /professors/me/endorsements | EndorsementDecision | EndorsementRequest |
| GET | /surveys?audience=STUDENT\|PROFESSOR | — | Survey[] |

## Provisional frontend-required endpoints

The backend developer must confirm these additional paths.

| Method | Path | Response data |
| --- | --- | --- |
| GET | /students/me/dashboard | AcademicDashboard |
| GET | /students/me/courses | Course summary DTO[] |
| GET | /professors/me/dashboard | AcademicDashboard |
| GET | /professors/me/courses | Course summary DTO[] |
| GET | /assessments/:id | Safe assessment DTO |
| GET | /students/me/learning-plans/:courseId | LearningPlan |
| GET | /professors/me/courses/:courseId/interventions | TeachingIntervention[] |
| PATCH | /professors/me/courses/:courseId/interventions/:interventionId | TeachingIntervention; request `{ status: APPROVED | REJECTED }` |

The last PATCH separates professor decisions from suggestion generation. Confirm whether NestJS instead uses the planned POST with a decision discriminator.

## Domain models and DTO assumptions

Stable frontend interfaces are split across `src/types/` by domain. Runtime contracts live in `src/features/*/contracts.ts`; they validate transport payloads as unknown. Shared scalar/user/evidence schemas live in `lib/api/schemas.ts`. Adapters are the only layer that translates DTO field names.

Course summary DTO:
```ts
{
  course_id: string;
  title: string;
  code: string;
  professor_id: string;
  student_count: number;
  outcome_count: number;
}
```

Course detail extends summary with `description`, `teacher`, `learners`, `enrollments`, `outcomes`, `materials`, `assessments`, and `latest_feedback`. The adapter maps these to `id`, `professor`, `students`, `latestFeedback`, etc. Student DTOs contain only their own learner/enrollment record; professor DTOs contain the owned cohort.

Assessment DTO:
```ts
{
  assessment_id: string;
  course_id: string;
  assessment_type: "DIAGNOSTIC" | "FOLLOW_UP";
  title: string;
  estimated_minutes: number;
  questions: {
    id: string;
    outcomeId: string;
    type: "MULTIPLE_CHOICE" | "SHORT_ANSWER";
    prompt: string;
    options: { id: string; text: string }[];
  }[];
}
```

There are no correct-answer fields before submission. Grading fixtures are internal to the synthetic handler. The response validator strips unrecognized grading fields defensively. Client-bundled demo fixtures are inspectable; only backend grading will provide production secrecy.

Other response DTOs provisionally use camelCase domain fields inside `data`, with explicit feature adapters even when current adaptation is identity:

- AcademicDashboard: user ID, course IDs, next action, optional feedback.
- SubmissionResult: assessment/student IDs, ISO timestamp, correctness score, per-question feedback with outcome and misconception IDs, per-outcome before/after/change, explanation, next action.
- MasterySummary: student/course IDs, overall percentage, per-outcome level/percentage, diagnostic/follow-up/change, evidence and misconceptions.
- LearningPlan: ordered typed tasks, status, estimated minutes, reason, outcome ID, future course action URL.
- ClassInsight: outcome aggregates, misconceptions, question difficulty, support groups, evidence assessment IDs and explanation.
- TeachingIntervention: professor/course/outcome IDs, evidence, suggested action, affected count and professor decision status.
- OpportunityDashboard: career profile, skill gaps, project evidence, factor-ranked recommendations and current endorsement requests.
- StudentEvidence: consented student summary, identical academic mastery, project/technical evidence, communication/collaboration evidence, request IDs.
- Survey: audience, estimated minutes, active flag and nullable external URL.

ISO dates remain strings in domain models. Percentages are validated to 0–100. Backend display content must use Uzbek Latin or a separately agreed localization contract.

## Request DTO details

- Submission: `{ answers: [{ questionId, optionId? , text? }] }`. Exactly one answer per assessment question. Multiple-choice uses only a valid option ID; short-answer uses only nonempty text. Student identity is taken from session/auth, never a request body.
- CareerProfileUpdate: optional `targetRole` and `targetRoleId` supplied together, optional `interests`, optional full `consent` object with `discoverable`, `peerRecommendations`, `professorEvidenceReview`. Derived skills and readiness are not writable.
- Recommendation update: `{ status: NEW | SAVED | ACCEPTED | DISMISSED }`. Saving/accepting changes only recommendation state; it does not claim participation or invent evidence.
- EndorsementRequestInput: `{ professorId, opportunityId?, targetRole, consentToReview }`. Explicit review consent must be true.
- EndorsementDecision: `{ requestId, status: APPROVED | DECLINED | NEEDS_DEVELOPMENT, feedback? }`. Only an owning professor may decide a requested, consented record.
- Materials are JSON text for this phase. Confirm multipart uploads, file metadata and storage URLs before binary upload UI.
- Generation operations use deterministic fixtures now. Confirm asynchronous AI job/result behavior before integration.

## Enum values

| Type | Values |
| --- | --- |
| UserRole | STUDENT, PROFESSOR |
| MasteryLevel | NEEDS_SUPPORT, DEVELOPING, PROFICIENT, MASTERED |
| LearningTaskType | EXPLANATION, PRACTICE, MINI_PROJECT, FOLLOW_UP_DIAGNOSTIC |
| TaskStatus | NOT_STARTED, IN_PROGRESS, COMPLETED |
| QuestionType | MULTIPLE_CHOICE, SHORT_ANSWER |
| AssessmentType | DIAGNOSTIC, FOLLOW_UP |
| InterventionStatus | SUGGESTED, APPROVED, REJECTED |
| OpportunityType | PEER, MENTOR, CLUB, PROJECT, INTERNSHIP, JOB |
| RecommendationStatus | NEW, SAVED, ACCEPTED, DISMISSED |
| CareerReadinessStage | FOUNDATION, PROJECT_READY, INTERNSHIP_READY, JUNIOR_READY |
| EvidenceSourceType | ASSESSMENT, PROJECT, PROFESSOR_VERIFICATION |
| VerificationStatus | UNVERIFIED, VERIFIED, PENDING |
| EndorsementStatus | REQUESTED, APPROVED, DECLINED, NEEDS_DEVELOPMENT |

## Errors and transport

Proposed backend failures: `{ code: string, message?: string, details?: unknown }` with the proper HTTP status. Frontend `ApiError` has normalized `code`, `status`, typed localized `messageKey`, optional validation/backend details and original cause. Untrusted server messages are never shown directly.

Normalized codes: NOT_FOUND, VALIDATION_ERROR, NETWORK_ERROR, INVALID_RESPONSE, UNAUTHORIZED, FORBIDDEN, MOCK_ERROR, HTTP_ERROR, ABORTED. The original backend code is retained in details pending agreement on a shared code registry.

HTTP supports GET/POST/PATCH, normalized base URL, JSON, encoded query parameters, AbortSignal, empty responses, and typed errors. An empty successful response returns undefined; services whose DTO schema requires JSON reject it as INVALID_RESPONSE. Requests are not retried by transport; the existing Query provider controls query retries.

## Synthetic golden demo and mutations

Seed data: the exact Phase 2 professor, ten students including the exact demo student, one Programming Fundamentals course, four recursion outcomes, two five-question mixed assessments, misconceptions, a four-task plan, derived cohort insights, two interventions, one personal project, three club/project opportunities, a peer and mentor, six internships/junior roles, a requested endorsement, and two surveys. Career opportunities are synthetic descriptions, not live vacancies.

Dilnoza's diagnostic mastery is [85, 85, 35, 35], overall 60%. Its five-question correctness score is 40%; correctness score and outcome mastery are distinct measures. Demo mastery rubric assigns correct diagnostic feedback 85%, incorrect 35%; correct follow-up feedback 90%, incorrect 55%, averaging questions per outcome and then outcomes. These are transparent demo estimates, not a calibrated AI model. A fully correct follow-up yields 90% mastery. Six other students already have follow-up evidence.

Cohort diagnostic averages cover all enrolled students. Follow-up averages cover completed students only. Improvement compares each completed student's follow-up with that student's diagnostic baseline; it is not the difference between differently sized cohort averages. Missing follow-up remains null.

Submission replaces that student's result for the assessment and updates mastery, evidence, plan task statuses, course feedback, intervention affected counts, derived career skills, cohort insight and professor evidence. Resubmitting the diagnostic resets that student's follow-up stage and removes its follow-up result. Plan generation refreshes the existing deterministic plan. Outcome extraction and assessment/intervention generation return seeded fixtures; they do not run AI, publish an assessment, change a grade, or approve an intervention.

Other mutations persist material text, profile/consent, recommendation status, endorsement request/decision/history, and intervention decisions in memory. Repeated pending endorsement requests for the same student/professor/target are idempotent. A full browser refresh restores the seed database; the selected demo auth role still persists. Switching roles without refresh retains the shared database.

`empty` changes meaningful GET collections to valid empty values without destroying seed state. Mutations remain functional in this scenario. `error` rejects all operations with typed MOCK_ERROR and never mutates state. Default delay is a fixed 120ms, with cancellation before mutation.

## Explainable matching

`features/opportunities/matching.ts` calculates bounded 0–100 factors:

| Factor | Weight | Meaning |
| --- | --- | --- |
| targetRoleAlignment | 30% | Target role ID matches |
| demonstratedSkills | 25% | Fraction of required skills supported at >=70% mastery |
| missingSkillRelevance | 20% | Fraction of identified gaps the opportunity addresses |
| collaborationFit | 15% | Collaborative opportunity addresses missing collaboration evidence |
| evidenceStrength | 10% | Mean mastery of related demonstrated skills |

Weighted total ranks opportunity relevance. Named factors and an Uzbek explanation are always returned. Ties use stable recommendation IDs. There is no personality assessment or claim about a student's worth. Confirm role and skill taxonomy with the backend.

## Consent and survey behavior

The main student is not publicly discoverable. The seed represents explicit prior opt-in to peer recommendations and a requested professor endorsement. The peer candidate also explicitly opted in to discoverability and peer recommendations; other students have no discoverable career profile. Withdrawing peer consent removes peer results. Professor evidence requires both current review consent and a consented request for the owning professor; withdrawing consent also hides referral candidates. Requesting an endorsement with explicit consent restores review permission.

Survey fixtures read external URLs only through the existing typed environment adapter. Empty survey variables produce null URLs; future UI must not render dead external links. HTTP backend survey data is runtime-validated and may supply the URL. Audience filtering is keyed by the authenticated role.

## Queries, invalidation and validation

Hooks cover student/professor dashboards, lists/detail, assessment/submission, mastery, plan generation/read, cohort insights, interventions/decision/generation, growth-plan generation, opportunity dashboard/recommendations/profile/status/request, referral candidates/evidence/decision, and role-filtered surveys.

Keys include current demo user and role where payloads differ. Queries wait for auth hydration and the correct role. Mutations check the active role before execution. Assessment submission invalidates only its assessment, course/mastery/plan, student dashboard, career resources, and the owning professor's insight/intervention/referral evidence caches. Other mutations invalidate their own affected resources with exact keys.

Run `npm run validate:data`: the installed TypeScript compiler loads validation source without an additional framework. It checks ID references, grading-key exclusion, DTO/schema boundaries, populated/empty/error scenarios, golden-demo mutations, consent withdrawal, recommendation factors, exact query invalidation, and HTTP JSON/error/abort behavior. `npm run lint`, `npx tsc --noEmit` and `npm run build` remain required; use `npm run build -- --webpack` only for the known sandbox Turbopack worker limitation.

## Backend confirmations still needed

Envelope/field casing; all provisional paths; pagination/cursors; role/skill IDs; JWT/401 contract; file upload format; AI generation jobs; mastery calibration; task completion endpoints; status transitions/idempotency; evidence verification; professor ownership/consent enforcement; survey URLs and audience policy. Keep changes inside contracts, adapters, endpoints and transport so later pages remain stable.
