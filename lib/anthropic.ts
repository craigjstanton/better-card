import Anthropic from "@anthropic-ai/sdk";
import { SpendingAnalysis } from "@/types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const CATEGORIZATION_SYSTEM = `You are a financial data analyst specializing in categorizing bank transactions.
Given bank statement data (either raw transactions or a PDF statement), categorize spending into categories and return a JSON analysis.

Categories to use (pick the most appropriate):
- dining (restaurants, cafes, fast food, bars)
- grocery (supermarkets, food stores)
- travel (airlines, hotels, vacation bookings)
- gas (gas stations, fuel)
- streaming (Netflix, Spotify, Hulu, Disney+, etc.)
- transit (Uber, Lyft, subway, bus, parking)
- shopping (Amazon, retail stores, clothing)
- utilities (electric, water, internet, phone bills)
- healthcare (doctors, pharmacy, medical)
- online_grocery (Instacart, Amazon Fresh, delivery)
- hotels (hotels, Airbnb, lodging)
- rental_cars (car rentals)
- entertainment (movies, concerts, events)
- education (tuition, books, courses)
- fitness (gym, sports)
- other (anything that doesn't fit above)

Return ONLY valid JSON in this exact format:
{
  "categories": [
    { "category": "dining", "amount": 450.00, "percentage": 22.5 },
    { "category": "grocery", "amount": 320.00, "percentage": 16.0 }
  ],
  "totalSpend": 2000.00,
  "period": "estimated monthly",
  "transactionCount": 45
}

Rules:
- amounts and percentages must be numbers (not strings)
- percentages must sum to 100
- only include categories with non-zero spend
- sort by amount descending`;

export async function categorizeSpendingFromText(
  statementText: string
): Promise<SpendingAnalysis> {
  return runCategorization([
    {
      role: "user",
      content: `Please analyze these bank statement transactions and categorize the spending:\n\n${statementText}`,
    },
  ]);
}

export async function categorizeSpendingFromPDF(
  pdfBuffer: Buffer
): Promise<SpendingAnalysis> {
  return runCategorization([
    {
      role: "user",
      content: [
        {
          type: "document",
          source: {
            type: "base64",
            media_type: "application/pdf",
            data: pdfBuffer.toString("base64"),
          },
        },
        {
          type: "text",
          text: "Please analyze this bank statement PDF and categorize all the spending transactions.",
        },
      ],
    },
  ]);
}

async function runCategorization(
  messages: Anthropic.MessageParam[]
): Promise<SpendingAnalysis> {
  const stream = await client.messages.stream({
    model: "claude-opus-4-6",
    max_tokens: 8192,
    system: CATEGORIZATION_SYSTEM,
    messages,
  });

  const response = await stream.finalMessage();

  const textBlocks = response.content.filter((b) => b.type === "text");

  if (textBlocks.length === 0) {
    throw new Error(
      `No text block in Claude response. stop_reason=${response.stop_reason}, blocks=${response.content.map((b) => b.type).join(",")}`
    );
  }

  const fullText = textBlocks
    .map((b) => (b.type === "text" ? b.text : ""))
    .join("\n")
    .trim();

  // Extract JSON — handles ```json ... ```, ``` ... ```, or bare JSON
  const jsonMatch = fullText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  const jsonStr = jsonMatch ? jsonMatch[1].trim() : fullText;

  let parsed: SpendingAnalysis;
  try {
    parsed = JSON.parse(jsonStr) as SpendingAnalysis;
  } catch (e) {
    throw new Error(`Failed to parse Claude response as JSON: ${e instanceof Error ? e.message : e}`);
  }

  if (!parsed.categories || !Array.isArray(parsed.categories)) {
    throw new Error("Invalid response structure: missing categories array");
  }

  return parsed;
}

export async function generateRecommendationReasoning(
  spendingAnalysis: SpendingAnalysis,
  topCardName: string,
  estimatedValue: number
): Promise<string> {
  const response = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Given this spending profile:
${spendingAnalysis.categories.map((c) => `- ${c.category}: $${c.amount.toFixed(2)} (${c.percentage.toFixed(1)}%)`).join("\n")}
Total monthly spend: $${spendingAnalysis.totalSpend.toFixed(2)}

The top recommended card is "${topCardName}" with an estimated annual rewards value of $${estimatedValue.toFixed(0)}.

In 2-3 sentences, explain WHY this card is the best match for this spending pattern. Be specific about which categories drive the most value.`,
      },
    ],
  });

  const block = response.content.find((b) => b.type === "text");
  return block && block.type === "text" ? block.text : "";
}
