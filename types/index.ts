export interface SpendingCategory {
  category: string;
  amount: number;
  percentage: number;
}

export interface SpendingAnalysis {
  categories: SpendingCategory[];
  totalSpend: number;
  period: string;
  transactionCount: number;
}

export interface AnnualCredit {
  description: string;
  value: number; // dollar value of the credit/benefit
}

export interface CreditCard {
  id: string;
  name: string;
  issuer: string;
  annualFee: number;
  annualCredits: AnnualCredit[]; // statement credits and recurring benefits
  rewards: {
    category: string;
    rate: number; // points or cash back % per dollar
    type: "points" | "cashback" | "miles";
  }[];
  signupBonus?: {
    value: number;
    spendRequired: number;
    timeframeDays: number;
  };
  baseRewardRate: number;
  rewardType: "points" | "cashback" | "miles";
  pointValue?: number; // cents per point for points/miles cards
  notes: string;
  imageUrl?: string;
  applyUrl?: string;
}

export interface CardRecommendation {
  card: CreditCard;
  estimatedAnnualValue: number; // rewards only
  totalCreditsValue: number;    // sum of annual credits/perks
  effectiveAnnualFee: number;   // annualFee - totalCreditsValue
  netAnnualValue: number;       // rewards + credits - fee
  breakdown: {
    category: string;
    spend: number;
    rewardRate: number;
    value: number;
  }[];
  rank: number;
}

export interface AnalysisResult {
  spending: SpendingAnalysis;
  recommendations: CardRecommendation[];
  topCard: CardRecommendation;
  reasoning: string;
}
