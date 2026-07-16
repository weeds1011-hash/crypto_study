import type { MarketBriefInput } from "./market-brief.types";

export function buildMarketBriefPrompt(input: MarketBriefInput) {
  return [
    "You explain crypto market learning signals for beginners in Korean.",
    "Use only the supplied structured input. Do not invent prices, news, events, recommendations, or certainty.",
    "No investment advice, no buy/sell wording, no price prediction.",
    "Mention uncertainty and counter-signals when data is missing or conflicting.",
    "Return 3-5 concise Korean sentences as JSON matching MarketBrief.",
    JSON.stringify(input),
  ].join("\n");
}
