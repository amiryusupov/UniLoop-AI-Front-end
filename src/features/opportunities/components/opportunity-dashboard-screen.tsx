"use client";

import { ContextState } from "@/components/feedback/context-state";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { PageContainer } from "@/components/shared/page-container";
import { AcademicEvidenceLinks } from "@/features/opportunities/components/academic-evidence-links";
import { CareerProfileCard } from "@/features/opportunities/components/career-profile-card";
import { ConsentControls } from "@/features/opportunities/components/consent-controls";
import { EndorsementPanel } from "@/features/opportunities/components/endorsement-panel";
import { GapAnalysis } from "@/features/opportunities/components/gap-analysis";
import { ProjectEvidenceList } from "@/features/opportunities/components/project-evidence-list";
import { ReadinessPanel } from "@/features/opportunities/components/readiness-panel";
import { RecommendationCard } from "@/features/opportunities/components/recommendation-card";
import { SkillEvidenceList } from "@/features/opportunities/components/skill-evidence-list";
import { useOpportunityDashboard } from "@/features/opportunities/queries";
import { t } from "@/i18n";

export function OpportunityDashboardScreen() {
  const dashboard = useOpportunityDashboard();
  if (dashboard.isLoading)
    return (
      <PageContainer className="py-8">
        <LoadingState cards={6} />
      </PageContainer>
    );
  if (dashboard.isError)
    return (
      <PageContainer className="py-8">
        <ErrorState retry={() => void dashboard.refetch()} />
      </PageContainer>
    );
  if (
    !dashboard.data ||
    (!dashboard.data.profile.skills.length &&
      !dashboard.data.recommendations.length &&
      !dashboard.data.projects.length &&
      !dashboard.data.endorsementRequests.length)
  )
    return (
      <PageContainer className="py-8">
        <EmptyState />
      </PageContainer>
    );
  const { profile, gaps, recommendations, projects, endorsementRequests } =
    dashboard.data;
  const connections = recommendations.filter(
    (item) =>
      item.opportunity.type !== "JOB" && item.opportunity.type !== "INTERNSHIP",
  );
  const careers = recommendations.filter(
    (item) =>
      item.opportunity.type === "JOB" || item.opportunity.type === "INTERNSHIP",
  );
  const primary = connections.find(
    (item) => item.status !== "DISMISSED" && item.status !== "ACCEPTED",
  );
  const orderedConnections = primary
    ? [primary, ...connections.filter((item) => item.id !== primary.id)]
    : connections;
  return (
    <PageContainer className="space-y-8 py-8 sm:py-10">
      <header>
        <p className="text-sm font-medium text-primary">
          {t("homeLoopDevelopment")}
        </p>
        <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight">
          {t("navOpportunities")}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          {t("opportunityIntro")}
        </p>
      </header>
      <section
        className="grid gap-4 lg:grid-cols-2"
        aria-label={t("careerProfile")}
      >
        <CareerProfileCard profile={profile} />
        <ReadinessPanel profile={profile} gaps={gaps} />
      </section>
      <section className="space-y-4">
        <h2 className="font-heading text-xl font-semibold">
          {t("skillEvidence")}
        </h2>
        <AcademicEvidenceLinks />
        <SkillEvidenceList skills={profile.skills} studentLinks />
      </section>
      <section className="space-y-3">
        <h2 className="font-heading text-xl font-semibold">
          {t("projectEvidence")}
        </h2>
        <ProjectEvidenceList projects={projects} />
      </section>
      <section className="space-y-3">
        <h2 className="font-heading text-xl font-semibold">
          {t("gapAnalysis")}
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          {t("gapIntro")}
        </p>
        <GapAnalysis gaps={gaps} />
      </section>
      <section className="space-y-4">
        <h2 className="font-heading text-xl font-semibold">
          {t("navRecommendedConnections")}
        </h2>
        {!profile.consent.peerRecommendations ? (
          <ContextState
            title="noPeerConsentTitle"
            description="noPeerConsentDescription"
          />
        ) : null}
        {connections.length ? (
          <div className="grid items-start gap-4 lg:grid-cols-2">
            {orderedConnections.map((item) => (
              <RecommendationCard
                gaps={gaps}
                key={item.id}
                primary={item.id === primary?.id}
                profile={profile}
                recommendation={item}
              />
            ))}
          </div>
        ) : (
          <ContextState title="emptyTitle" description="emptyDescription" />
        )}
      </section>
      <section className="space-y-4">
        <h2 className="font-heading text-xl font-semibold">
          {t("recommendedCareer")}
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          {t("careerOpportunityNote")}
        </p>
        {careers.length ? (
          <div className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
            {careers.map((item) => (
              <RecommendationCard
                gaps={gaps}
                key={item.id}
                profile={profile}
                recommendation={item}
              />
            ))}
          </div>
        ) : (
          <ContextState title="emptyTitle" description="emptyDescription" />
        )}
      </section>
      <section
        className="grid items-start gap-4 xl:grid-cols-2"
        aria-label={t("navProfessorEndorsement")}
      >
        <EndorsementPanel
          profile={profile}
          recommendations={recommendations}
          requests={endorsementRequests}
        />
        <ConsentControls consent={profile.consent} />
      </section>
    </PageContainer>
  );
}
