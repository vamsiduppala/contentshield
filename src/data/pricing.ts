import type { Plan } from "../types";

export const pricingPlans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    priceMonthly: 9,
    description: "For creators validating drafts before upload.",
    scans: "20 monthly scans",
    features: ["AI risk report", "Timestamp export", "Caption checks", "Basic sensitive word list"]
  },
  {
    id: "creator-pro",
    name: "Creator Pro",
    priceMonthly: 29,
    description: "For serious channels that need faster review loops.",
    scans: "100 monthly scans",
    recommended: true,
    features: ["AI risk report", "Timestamp export", "Custom sensitive word list", "Priority scan queue"]
  },
  {
    id: "agency",
    name: "Agency",
    priceMonthly: 99,
    description: "For teams managing creator portfolios.",
    scans: "500 monthly scans",
    features: ["AI risk report", "Timestamp export", "Custom sensitive word list", "Team access"]
  }
];
