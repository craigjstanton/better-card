"use client";

import { SpendingAnalysis } from "@/types";

interface SpendingChartProps {
  spending: SpendingAnalysis;
}

const PALETTE = [
  "#22c55e", // green-500
  "#16a34a", // green-600
  "#4ade80", // green-400
  "#86efac", // green-300
  "#3b82f6", // blue-500
  "#60a5fa", // blue-400
  "#f59e0b", // amber-500
  "#f97316", // orange-500
  "#a855f7", // purple-500
  "#ec4899", // pink-500
];

const CATEGORY_EMOJI: Record<string, string> = {
  dining: "🍽️",
  grocery: "🛒",
  travel: "✈️",
  gas: "⛽",
  streaming: "📺",
  transit: "🚌",
  shopping: "🛍️",
  utilities: "💡",
  healthcare: "💊",
  online_grocery: "📦",
  hotels: "🏨",
  rental_cars: "🚗",
  entertainment: "🎬",
  education: "📚",
  fitness: "🏋️",
  other: "💳",
};

export default function SpendingChart({ spending }: SpendingChartProps) {
  const top = spending.categories.slice(0, 8);
  const maxAmount = Math.max(...top.map((c) => c.amount));

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-50">
        <h2 className="text-xl font-bold text-gray-900">Your Spending Breakdown</h2>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
          <span className="text-sm text-gray-500">
            {spending.transactionCount} transactions
          </span>
          <span className="text-gray-300">·</span>
          <span className="text-sm text-gray-500">{spending.period}</span>
          <span className="text-gray-300">·</span>
          <span className="text-sm font-semibold text-green-600">
            ${spending.totalSpend.toLocaleString("en-US", { minimumFractionDigits: 2 })} total
          </span>
        </div>
      </div>

      {/* Stacked bar — visual overview */}
      <div className="px-6 py-4 flex rounded-xl overflow-hidden h-4 gap-0.5">
        {top.map((cat, i) => (
          <div
            key={cat.category}
            title={`${cat.category}: ${cat.percentage.toFixed(1)}%`}
            className="h-full first:rounded-l-full last:rounded-r-full transition-all"
            style={{
              width: `${cat.percentage}%`,
              backgroundColor: PALETTE[i % PALETTE.length],
            }}
          />
        ))}
      </div>

      {/* Category rows */}
      <div className="px-6 pb-6 space-y-3">
        {top.map((cat, i) => (
          <div key={cat.category} className="flex items-center gap-3">
            {/* Emoji */}
            <span className="text-lg w-7 text-center flex-shrink-0">
              {CATEGORY_EMOJI[cat.category] ?? "💳"}
            </span>

            {/* Bar + label */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm font-medium text-gray-700 capitalize truncate">
                  {cat.category.replace(/_/g, " ")}
                </span>
                <span className="text-sm text-gray-500 ml-2 flex-shrink-0">
                  ${cat.amount.toLocaleString("en-US", { minimumFractionDigits: 0 })}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full transition-all duration-700"
                  style={{
                    width: `${(cat.amount / maxAmount) * 100}%`,
                    backgroundColor: PALETTE[i % PALETTE.length],
                  }}
                />
              </div>
            </div>

            {/* Percentage pill */}
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
              style={{
                backgroundColor: PALETTE[i % PALETTE.length] + "20",
                color: PALETTE[i % PALETTE.length],
              }}
            >
              {cat.percentage.toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
