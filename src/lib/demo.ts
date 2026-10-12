/**
 * Example data shared by the interactive product mocks (hero dashboard, feature tiles, architecture
 * trace). Everything ties back to one company on one day: Northwind Studio, Oct 12, 2026, with $58,030
 * cash on hand and 14.2 months of runway. The month-end totals match cash-chart.tsx and problem.tsx.
 */

export const money = (v: number) => `${v < 0 ? "−" : ""}$${Math.abs(Math.round(v)).toLocaleString("en-US")}`;
export const signed = (v: number) => `${v > 0 ? "+" : ""}${money(v)}`;

export const balances = [
  { name: "Chase operating", kind: "Checking ··4821", amount: 41_260 },
  { name: "Stripe balance", kind: "Payments", amount: 13_110 },
  { name: "Savings", kind: "Savings ··0917", amount: 7_000 },
  { name: "Amex Business Gold", kind: "Card ··1003", amount: -3_340 },
];

export const cashOnHand = balances.reduce((sum, b) => sum + b.amount, 0);

export const upcoming = [
  { date: "Oct 15", what: "Payroll", amount: -18_400 },
  { date: "Oct 20", what: "Acme Co. invoice", amount: 4_800 },
  { date: "Oct 31", what: "Quarterly tax", amount: -6_200 },
];

/** The what-if used across the site: hiring in December. */
export const scenarios = {
  base: { label: "As things are", runway: 14.2, janCash: 63_500 },
  hire: { label: "Hire in December", runway: 11.6, janCash: 51_800 },
} as const;
export type Scenario = keyof typeof scenarios;

type Line = { line: string; amount: number; change?: string; good?: boolean };
export type Statement = { title: string; rows: Line[]; total: Line };

// September statements. Net income, the change in cash and the month-end balances agree with each other
// and with the cash report in the problem section (Aug $49,600 → Sep $55,700).
export const statements: Record<"pnl" | "cashflow" | "balance", Statement> = {
  pnl: {
    title: "Profit and loss · September",
    rows: [
      { line: "Revenue", amount: 48_200, change: "+12%", good: true },
      { line: "Cost of sales", amount: -9_600, change: "+3%", good: false },
      { line: "Software & hosting", amount: -3_100, change: "−8%", good: true },
      { line: "Payroll", amount: -18_400, change: "0%" },
    ],
    total: { line: "Net income", amount: 17_100, change: "+21%", good: true },
  },
  cashflow: {
    title: "Cash flow · September",
    rows: [
      { line: "Net income", amount: 17_100 },
      { line: "Unpaid invoices", amount: -4_800 },
      { line: "Owner draw", amount: -5_000 },
      { line: "Tax payments", amount: -1_200 },
    ],
    total: { line: "Change in cash", amount: 6_100 },
  },
  balance: {
    title: "Balance sheet · Sep 30",
    rows: [
      { line: "Cash and savings", amount: 58_700 },
      { line: "Accounts receivable", amount: 4_800 },
      { line: "Credit card", amount: -3_000 },
      { line: "Sales tax owed", amount: -1_900 },
    ],
    total: { line: "Equity", amount: 58_600 },
  },
};

export type Txn = { id: string; what: string; category: string; amount: number; when: string };

export const transactions: Txn[] = [
  { id: "t1", what: "Stripe payout", category: "Income", amount: 6_940.2, when: "Just now" },
  { id: "t2", what: "AWS", category: "Software & hosting", amount: -1_240, when: "4 min ago" },
  { id: "t3", what: "Figma", category: "Software & hosting", amount: -75, when: "1 hr ago" },
  { id: "t4", what: "Acme Co. invoice", category: "Income", amount: 4_800, when: "Today" },
  { id: "t5", what: "WeWork", category: "Rent", amount: -1_850, when: "Yesterday" },
  { id: "t6", what: "Shopify payout", category: "Income", amount: 2_315.4, when: "Yesterday" },
  { id: "t7", what: "Google Workspace", category: "Software & hosting", amount: -144, when: "Oct 10" },
  { id: "t8", what: "Delta Air Lines", category: "Travel", amount: -612.3, when: "Oct 9" },
  { id: "t9", what: "Gusto payroll", category: "Payroll", amount: -18_400, when: "Sep 30" },
];

/** Transactions the live feed in How it works keeps adding, one at a time. */
export const incoming: Omit<Txn, "id" | "when">[] = [
  { what: "Shopify payout", category: "Income", amount: 2_315.4 },
  { what: "Notion", category: "Software & hosting", amount: -96 },
  { what: "Stripe payout", category: "Income", amount: 1_208.75 },
  { what: "Uber", category: "Travel", amount: -38.6 },
  { what: "Linear", category: "Software & hosting", amount: -64 },
  { what: "Globex invoice", category: "Income", amount: 3_150 },
  { what: "Vercel", category: "Software & hosting", amount: -20 },
];

export const cents = (v: number) =>
  `${v < 0 ? "−" : "+"}$${Math.abs(v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
