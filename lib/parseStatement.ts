import Papa from "papaparse";

export interface RawTransaction {
  date: string;
  description: string;
  amount: number;
}

export function parseCSV(text: string): RawTransaction[] {
  const result = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase(),
  });

  const transactions: RawTransaction[] = [];

  for (const row of result.data) {
    // Try common column name patterns across bank CSV formats
    const date =
      row["date"] || row["transaction date"] || row["post date"] || "";
    const description =
      row["description"] ||
      row["merchant"] ||
      row["name"] ||
      row["payee"] ||
      "";
    const amountRaw =
      row["amount"] ||
      row["debit"] ||
      row["charge"] ||
      row["transaction amount"] ||
      "";

    if (!description || !amountRaw) continue;

    // Parse amount: handle negative signs, parentheses (debit notation), currency symbols
    const cleaned = amountRaw.replace(/[$,()]/g, "").trim();
    const amount = Math.abs(parseFloat(cleaned));

    if (isNaN(amount) || amount === 0) continue;

    transactions.push({ date, description, amount });
  }

  return transactions;
}

export function transactionsToText(transactions: RawTransaction[]): string {
  return transactions
    .map((t) => `${t.date} | ${t.description} | $${t.amount.toFixed(2)}`)
    .join("\n");
}
