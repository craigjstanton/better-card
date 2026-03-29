"use client";

import Image from "next/image";
import { CardRecommendation, AnalysisResult } from "@/types";

interface Props {
  result: AnalysisResult;
}

const ISSUER_COLOR: Record<string, string> = {
  Chase: "bg-blue-100 text-blue-700",
  "American Express": "bg-purple-100 text-purple-700",
  Citi: "bg-cyan-100 text-cyan-700",
  "Capital One": "bg-red-100 text-red-700",
  Discover: "bg-orange-100 text-orange-700",
  "Wells Fargo": "bg-yellow-100 text-yellow-700",
};

function CardImage({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  if (!src) return null;
  return (
    <div className={`relative ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain drop-shadow-md"
        sizes="(max-width: 640px) 220px, 278px"
        unoptimized // serve as-is; these are already optimized PNGs
      />
    </div>
  );
}

function WinnerCard({ rec }: { rec: CardRecommendation }) {
  const { card } = rec;
  const topCategories = rec.breakdown
    .filter((b) => b.value > 0 && b.rewardRate > card.baseRewardRate)
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);

  return (
    <div className="relative bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-6 text-white shadow-xl shadow-green-200 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full -translate-y-20 translate-x-20" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-12 -translate-x-8" />

      {/* Winner badge */}
      <div className="flex items-center justify-between mb-4 relative">
        <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/30">
          🏆 Best Match for You
        </span>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white">
          #{rec.rank}
        </span>
      </div>

      {/* Card image + name row */}
      <div className="relative flex items-center gap-5 mb-5">
        {card.imageUrl && (
          <div className="flex-shrink-0 relative w-[160px] h-[101px]">
            <Image
              src={card.imageUrl}
              alt={card.name}
              fill
              className="object-contain drop-shadow-xl"
              sizes="160px"
              unoptimized
            />
          </div>
        )}
        <div>
          <h3 className="text-2xl font-bold leading-tight">{card.name}</h3>
          <p className="text-green-100 text-sm mt-0.5">{card.issuer}</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 relative mb-4">
        {[
          { label: "Rewards / yr", value: `$${rec.estimatedAnnualValue.toFixed(0)}` },
          {
            label: rec.totalCreditsValue > 0 ? "Effective fee" : "Annual fee",
            value: rec.effectiveAnnualFee === 0 ? "Free!" : `$${rec.effectiveAnnualFee.toFixed(0)}`,
          },
          { label: "Net value", value: `$${rec.netAnnualValue.toFixed(0)}` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white/15 rounded-2xl px-3 py-3 text-center">
            <p className="text-[10px] text-green-100 leading-tight mb-1">{label}</p>
            <p className="font-bold text-lg leading-none">{value}</p>
          </div>
        ))}
      </div>

      {/* Credits/perks breakdown */}
      {card.annualCredits.length > 0 && (
        <div className="relative bg-white/10 rounded-2xl px-4 py-3 mb-4">
          <p className="text-green-100 text-[10px] font-semibold uppercase tracking-wide mb-2">
            ${rec.totalCreditsValue} in annual credits & perks
            {card.annualFee > 0 && (
              <span className="ml-1 normal-case font-normal">
                (reduces ${card.annualFee} fee to ${rec.effectiveAnnualFee})
              </span>
            )}
          </p>
          <div className="space-y-1">
            {card.annualCredits.map((credit) => (
              <div key={credit.description} className="flex justify-between items-baseline gap-3">
                <span className="text-xs text-green-100 leading-snug">{credit.description}</span>
                <span className="text-xs font-semibold text-white flex-shrink-0">+${credit.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top earning categories */}
      {topCategories.length > 0 && (
        <div className="relative">
          <p className="text-green-100 text-xs font-medium mb-2 uppercase tracking-wide">
            Where you earn the most
          </p>
          <div className="flex flex-wrap gap-2">
            {topCategories.map((b) => (
              <span
                key={b.category}
                className="text-xs bg-white/20 px-3 py-1.5 rounded-full font-medium capitalize"
              >
                {b.category.replace(/_/g, " ")} · {b.rewardRate}×
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RunnerUpCard({ rec }: { rec: CardRecommendation }) {
  const { card } = rec;
  const issuerClass = ISSUER_COLOR[card.issuer] ?? "bg-gray-100 text-gray-600";
  const rewardTypeLabel =
    card.rewardType === "cashback" ? "Cash Back"
    : card.rewardType === "miles" ? "Miles"
    : "Points";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="flex items-stretch">
        {/* Card image panel */}
        <div className="flex-shrink-0 w-[140px] sm:w-[180px] bg-gray-50 flex items-center justify-center p-4 border-r border-gray-100">
          {card.imageUrl ? (
            <div className="relative w-full" style={{ aspectRatio: "1.586" }}>
              <Image
                src={card.imageUrl}
                alt={card.name}
                fill
                className="object-contain drop-shadow-md"
                sizes="180px"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-full bg-gray-200 rounded-xl" style={{ aspectRatio: "1.586" }} />
          )}
        </div>

        {/* Info panel */}
        <div className="flex-1 min-w-0 flex items-center justify-between gap-3 px-4 sm:px-5 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${issuerClass}`}>
                {card.issuer}
              </span>
              <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {rewardTypeLabel}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 leading-tight text-sm">{card.name}</h3>
            <p className="text-xs text-gray-400 mt-1">
              {card.annualFee === 0 ? (
                <span className="text-green-600 font-medium">No annual fee</span>
              ) : rec.effectiveAnnualFee === 0 ? (
                <span className="text-green-600 font-medium">Fee fully offset by credits</span>
              ) : (
                <>
                  <span className="line-through text-gray-300">${card.annualFee}</span>
                  {" "}
                  <span className="text-gray-500">→ ${rec.effectiveAnnualFee} effective fee</span>
                </>
              )}
            </p>
          </div>

          {/* Net value */}
          <div className="flex-shrink-0 text-right">
            <p className="text-xl font-bold text-green-600">${rec.netAnnualValue.toFixed(0)}</p>
            <p className="text-[10px] text-gray-400 leading-tight">net / year</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CardRecommendations({ result }: Props) {
  const [winner, ...runnerUps] = result.recommendations;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Your Card Matches</h2>
        <p className="text-gray-500 text-sm mt-1">
          Ranked by estimated net annual value based on your actual spending
        </p>
      </div>

      {/* AI reasoning callout */}
      {result.reasoning && (
        <div className="flex gap-4 bg-green-50 border border-green-100 rounded-2xl p-5">
          <div className="flex-shrink-0 w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center text-white text-base">
            ✦
          </div>
          <div>
            <p className="text-sm font-semibold text-green-800 mb-1">Why this card wins for you</p>
            <p className="text-sm text-green-700 leading-relaxed">{result.reasoning}</p>
          </div>
        </div>
      )}

      {/* Winner */}
      {winner && <WinnerCard rec={winner} />}

      {/* Runner-ups */}
      {runnerUps.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Other Strong Options
          </h3>
          <div className="space-y-3">
            {runnerUps.map((rec) => (
              <RunnerUpCard key={rec.card.id} rec={rec} />
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400 text-center pt-2">
        Estimates based on your spending patterns. Actual rewards may vary. Review card terms before applying.
      </p>
    </div>
  );
}
