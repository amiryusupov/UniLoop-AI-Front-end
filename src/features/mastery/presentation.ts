import type { TranslationKey } from "@/i18n";
import type { MasteryLevel } from "@/types/mastery";

export const masteryPresentation: Record<
  MasteryLevel,
  { label: TranslationKey; className: string }
> = {
  NEEDS_SUPPORT: {
    label: "masteryNeedsSupport",
    className: "border-red-200 bg-red-50 text-red-800",
  },
  DEVELOPING: {
    label: "masteryDevelopingLabel",
    className: "border-amber-200 bg-amber-50 text-amber-900",
  },
  PROFICIENT: {
    label: "masteryProficient",
    className: "border-blue-200 bg-blue-50 text-blue-800",
  },
  MASTERED: {
    label: "masteryMastered",
    className: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
};
