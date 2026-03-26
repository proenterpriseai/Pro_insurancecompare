export const INSURANCE_TYPES = {
  life: "생명보험",
  non_life: "손해보험",
  health: "실손보험",
  third_party: "제3보험",
} as const;

export const NEWS_CATEGORIES = {
  all: "전체",
  life: "생명보험",
  non_life: "손해보험",
  health: "실손보험",
  policy: "정책/제도",
  market: "시장동향",
} as const;

export type InsuranceType = keyof typeof INSURANCE_TYPES;
export type NewsCategory = keyof typeof NEWS_CATEGORIES;
