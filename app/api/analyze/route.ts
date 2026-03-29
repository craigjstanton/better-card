import { NextRequest, NextResponse } from "next/server";
import { parseCSV, transactionsToText } from "@/lib/parseStatement";
import {
  categorizeSpendingFromText,
  categorizeSpendingFromPDF,
  generateRecommendationReasoning,
} from "@/lib/anthropic";
import { rankCards } from "@/lib/rewards";
import { AnalysisResult } from "@/types";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileName = file.name.toLowerCase();
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let spending;

    if (fileName.endsWith(".pdf")) {
      // Pass PDF directly to Claude — no text extraction needed
      spending = await categorizeSpendingFromPDF(buffer);
    } else if (fileName.endsWith(".csv")) {
      const csvText = buffer.toString("utf-8");
      const transactions = parseCSV(csvText);
      if (transactions.length === 0) {
        return NextResponse.json(
          {
            error:
              "No valid transactions found in CSV. Check column names (date, description, amount).",
          },
          { status: 400 }
        );
      }
      spending = await categorizeSpendingFromText(transactionsToText(transactions));
    } else {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload a PDF or CSV." },
        { status: 400 }
      );
    }

    const recommendations = rankCards(spending);
    const topCard = recommendations[0];

    const reasoning = await generateRecommendationReasoning(
      spending,
      topCard.card.name,
      topCard.estimatedAnnualValue
    );

    const result: AnalysisResult = {
      spending,
      recommendations: recommendations.slice(0, 5),
      topCard,
      reasoning,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Analysis error:", error);
    const message = error instanceof Error ? error.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
