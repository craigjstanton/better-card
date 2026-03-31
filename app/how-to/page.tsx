import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Export Your Bank Statement — Better Card",
  description:
    "Step-by-step instructions for downloading your bank or credit card statement from Chase, American Express, Bank of America, Capital One, Wells Fargo, Citi, and Discover.",
};

const BANKS = [
  {
    name: "Chase",
    url: "chase.com",
    color: "bg-blue-50 border-blue-100",
    accent: "text-blue-700",
    dot: "bg-blue-500",
    formats: ["PDF", "CSV"],
    steps: [
      {
        label: "PDF statement",
        steps: [
          'Log in at chase.com and select your account',
          'Click "Statements & Documents" in the left menu',
          'Choose your statement month and click the download icon',
        ],
      },
      {
        label: "CSV (transaction export)",
        steps: [
          'Select your account, then click "See activity"',
          'Click the "Download" button above your transactions',
          'Choose "CSV" format, set your date range (90 days works well), and download',
        ],
      },
    ],
  },
  {
    name: "American Express",
    url: "americanexpress.com",
    color: "bg-purple-50 border-purple-100",
    accent: "text-purple-700",
    dot: "bg-purple-500",
    formats: ["PDF", "CSV"],
    steps: [
      {
        label: "PDF statement",
        steps: [
          'Log in and click your card name at the top',
          'Go to "Statements & Activity"',
          'Select a statement period and click "View PDF Statement"',
        ],
      },
      {
        label: "CSV (transaction export)",
        steps: [
          'On the "Statements & Activity" page, click "Download"',
          'Select "Spreadsheet (CSV)" as the format',
          'Choose your date range (up to 3 months) and click "Download"',
        ],
      },
    ],
  },
  {
    name: "Bank of America",
    url: "bankofamerica.com",
    color: "bg-red-50 border-red-100",
    accent: "text-red-700",
    dot: "bg-red-500",
    formats: ["PDF", "CSV"],
    steps: [
      {
        label: "PDF statement",
        steps: [
          'Log in and select your account from the overview',
          'Click the "Statements" tab',
          'Select the month and click the PDF icon to download',
        ],
      },
      {
        label: "CSV (transaction export)",
        steps: [
          'On your account page, click the "Download" icon near your transaction list',
          'Choose "Comma Separated Values (CSV)" as the file type',
          'Set a date range up to 18 months back and click "Download"',
        ],
      },
    ],
  },
  {
    name: "Capital One",
    url: "capitalone.com",
    color: "bg-red-50 border-red-100",
    accent: "text-red-800",
    dot: "bg-red-600",
    formats: ["PDF", "CSV"],
    steps: [
      {
        label: "PDF statement",
        steps: [
          'Log in and select your account',
          'Click the "Statements" tab',
          'Choose a billing period and click the PDF download button',
        ],
      },
      {
        label: "CSV (transaction export)",
        steps: [
          'Select your account and go to the "Transactions" view',
          'Click the download icon (↓) near the top of the transaction list',
          'Choose "CSV" format and your date range',
        ],
      },
    ],
  },
  {
    name: "Wells Fargo",
    url: "wellsfargo.com",
    color: "bg-yellow-50 border-yellow-100",
    accent: "text-yellow-800",
    dot: "bg-yellow-500",
    formats: ["PDF", "CSV"],
    steps: [
      {
        label: "PDF statement",
        steps: [
          'Log in and select your account',
          'Click "Statements & Documents" in the account menu',
          'Select the statement period and click to download the PDF',
        ],
      },
      {
        label: "CSV (transaction export)",
        steps: [
          'On your account page, click "Download Account Activity"',
          'Select your date range (up to 2 years)',
          'Choose "Comma Separated Values (CSV)" and click "Download"',
        ],
      },
    ],
  },
  {
    name: "Citi",
    url: "citi.com",
    color: "bg-cyan-50 border-cyan-100",
    accent: "text-cyan-700",
    dot: "bg-cyan-500",
    formats: ["PDF", "CSV"],
    steps: [
      {
        label: "PDF statement",
        steps: [
          'Log in and select your account',
          'Go to "Statements" in the top navigation',
          'Select the month and click "Download PDF"',
        ],
      },
      {
        label: "CSV (transaction export)",
        steps: [
          'On your account page, find the transaction list',
          'Click the download icon or "Download Transactions"',
          'Choose CSV format and your date range',
        ],
      },
    ],
  },
  {
    name: "Discover",
    url: "discover.com",
    color: "bg-orange-50 border-orange-100",
    accent: "text-orange-700",
    dot: "bg-orange-500",
    formats: ["PDF"],
    steps: [
      {
        label: "PDF statement",
        steps: [
          'Log in and click "Manage" in the top navigation',
          'Select "Statements & Docs"',
          'Choose your billing period and click the PDF icon to download',
        ],
      },
    ],
  },
];

const TIPS = [
  {
    icon: "📄",
    title: "PDF works best",
    body: "Our AI reads PDFs directly — no manual formatting needed. Most banks offer PDF statements going back 12–24 months.",
  },
  {
    icon: "📊",
    title: "CSV also works",
    body: "If you prefer CSV exports, that works too. Just make sure to export at least 2–3 months of transactions for an accurate picture.",
  },
  {
    icon: "📅",
    title: "Use 2–3 months",
    body: "A single month can be skewed by one-off purchases. Two to three months gives a much more representative spending pattern.",
  },
  {
    icon: "🔒",
    title: "Your data stays private",
    body: "Your statement is analyzed in memory by Claude AI and never stored, saved, or shared. It's deleted as soon as your session ends.",
  },
];

export default function HowToPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f7faf8]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-green-200">
              B
            </div>
            <span className="font-bold text-gray-900 text-lg tracking-tight">Better Card</span>
          </Link>
          <Link
            href="/"
            className="text-sm text-green-600 font-medium hover:text-green-700 transition-colors"
          >
            ← Back to upload
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 border border-green-100">
              ✦ Step-by-step guide
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
              How to export your<br className="hidden sm:block" /> bank statement
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed max-w-xl">
              Find your bank below and follow the steps to download a PDF or CSV statement to upload to Better Card.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-10">

          {/* Tips */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TIPS.map((tip) => (
              <div key={tip.title} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-3">
                <span className="text-xl flex-shrink-0 mt-0.5">{tip.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800 mb-0.5">{tip.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{tip.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bank instructions */}
          <div>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              Instructions by bank
            </h2>
            <div className="space-y-4">
              {BANKS.map((bank) => (
                <div
                  key={bank.name}
                  className={`rounded-2xl border p-5 ${bank.color}`}
                >
                  {/* Bank header */}
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${bank.dot}`} />
                    <div>
                      <h3 className={`font-bold text-base ${bank.accent}`}>{bank.name}</h3>
                      <p className="text-xs text-gray-400">{bank.url}</p>
                    </div>
                    <div className="ml-auto flex gap-1.5">
                      {bank.formats.map((f) => (
                        <span
                          key={f}
                          className="text-[10px] font-semibold bg-white/70 text-gray-500 border border-gray-200 px-2 py-0.5 rounded-full"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Steps — side by side on sm+ if two formats */}
                  <div className={`grid gap-4 ${bank.steps.length > 1 ? "sm:grid-cols-2" : "grid-cols-1"}`}>
                    {bank.steps.map((section) => (
                      <div key={section.label}>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                          {section.label}
                        </p>
                        <ol className="space-y-1.5">
                          {section.steps.map((step, i) => (
                            <li key={i} className="flex gap-2.5">
                              <span className={`flex-shrink-0 w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center mt-0.5 ${bank.dot}`}>
                                {i + 1}
                              </span>
                              <span className="text-xs text-gray-600 leading-snug">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-green-500 rounded-3xl p-7 text-white text-center">
            <p className="font-bold text-lg mb-1">Ready to find your best card?</p>
            <p className="text-green-100 text-sm mb-5">
              Upload your statement and get a personalized recommendation in seconds.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-white text-green-600 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-green-50 transition-colors"
            >
              Upload my statement →
            </Link>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                B
              </div>
              <span className="font-semibold text-gray-700 text-sm">Better Card</span>
            </div>
            <p className="text-xs text-gray-400 text-center sm:text-right max-w-sm">
              Estimates are for informational purposes only. Always review card terms before applying.
              Not affiliated with any card issuer.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
