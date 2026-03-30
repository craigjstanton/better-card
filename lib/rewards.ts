import { SpendingAnalysis, CreditCard, CardRecommendation } from "@/types";
import { CREDIT_CARDS } from "./cards";

// Maps Claude-returned category names to card reward category keys
const CATEGORY_MAP: Record<string, string[]> = {
  dining: ["dining", "restaurants", "food", "coffee", "fast food"],
  grocery: ["grocery", "groceries", "supermarket", "food & drink"],
  travel: ["travel", "airline", "hotel", "transportation", "flights", "vacation"],
  gas: ["gas", "fuel", "petrol", "gas station"],
  streaming: ["streaming", "subscriptions", "entertainment"],
  transit: ["transit", "subway", "uber", "lyft", "rideshare", "taxi"],
  online_grocery: ["online grocery", "instacart", "amazon fresh"],
  hotels: ["hotel", "lodging", "accommodation", "airbnb"],
  rental_cars: ["rental car", "car rental", "enterprise", "hertz"],
  drugstore: ["drugstore", "pharmacy", "cvs", "walgreens"],
  shopping: ["shopping", "retail", "amazon", "department store"],
  utilities: ["utilities", "electric", "water", "internet", "phone"],
  healthcare: ["healthcare", "medical", "doctor", "hospital"],
  other: ["other", "miscellaneous"],
};

function normalizeCategory(category: string): string {
  const lower = category.toLowerCase();
  for (const [key, synonyms] of Object.entries(CATEGORY_MAP)) {
    if (synonyms.some((s) => lower.includes(s) || s.includes(lower))) {
      return key;
    }
  }
  return "other";
}

function getRewardRateForCategory(card: CreditCard, category: string): number {
  const normalized = normalizeCategory(category);

  // Check specific reward categories first
  for (const reward of card.rewards) {
    if (reward.category === normalized || reward.category === category.toLowerCase()) {
      return reward.rate;
    }
  }

  // Fall back to base rate
  return card.baseRewardRate;
}

function calculateRewardValue(
  rate: number,
  spend: number,
  card: CreditCard
): number {
  if (card.rewardType === "cashback") {
    return (rate / 100) * spend;
  }
  // Points/miles: rate * spend * pointValue (in cents) / 100
  const pointValue = card.pointValue ?? 1;
  return (rate * spend * pointValue) / 100;
}

export function calculateCardValue(
  card: CreditCard,
  spending: SpendingAnalysis
): CardRecommendation {
  const breakdown: CardRecommendation["breakdown"] = [];
  let rewardsValue = 0;

  for (const category of spending.categories) {
    const rate = getRewardRateForCategory(card, category.category);
    const value = calculateRewardValue(rate, category.amount, card);
    rewardsValue += value;
    breakdown.push({
      category: category.category,
      spend: category.amount,
      rewardRate: rate,
      value,
    });
  }

  const totalCreditsValue = card.annualCredits.reduce((sum, c) => sum + c.value, 0);
  // effectiveAnnualFee is used only for display (the "sticker after credits" label).
  // netAnnualValue uses the full formula so surplus credit value is never lost.
  const effectiveAnnualFee = Math.max(0, card.annualFee - totalCreditsValue);
  const netAnnualValue = rewardsValue + totalCreditsValue - card.annualFee;

  return {
    card,
    estimatedAnnualValue: rewardsValue,
    totalCreditsValue,
    effectiveAnnualFee,
    netAnnualValue,
    breakdown,
    rank: 0,
  };
}

export function rankCards(spending: SpendingAnalysis): CardRecommendation[] {
  const recommendations = CREDIT_CARDS.map((card) =>
    calculateCardValue(card, spending)
  );

  // Sort by net annual value (rewards minus annual fee)
  recommendations.sort((a, b) => b.netAnnualValue - a.netAnnualValue);

  // Assign ranks
  return recommendations.map((rec, i) => ({ ...rec, rank: i + 1 }));
}
