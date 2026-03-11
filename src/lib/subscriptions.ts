export interface Subscription {
  name: string;
  category: string;
  dateAdded: string;
  frequency: string;
  amount: string;
  renewalDate: string;
  notification: boolean;
}

export const subscriptions: Subscription[] = [
  {
    name: "Netflix",
    category: "Entertainment",
    dateAdded: "Jan 04, 2025",
    frequency: "Monthly",
    amount: "$15.99",
    renewalDate: "Mar 13, 2026",
    notification: true,
  },
  {
    name: "Spotify",
    category: "Music",
    dateAdded: "Feb 10, 2025",
    frequency: "Monthly",
    amount: "$9.99",
    renewalDate: "Mar 16, 2026",
    notification: true,
  },
  {
    name: "YouTube Premium",
    category: "Entertainment",
    dateAdded: "May 23, 2025",
    frequency: "Monthly",
    amount: "$12.99",
    renewalDate: "Mar 19, 2026",
    notification: true,
  },
  {
    name: "Notion Plus",
    category: "Productivity",
    dateAdded: "Aug 02, 2025",
    frequency: "Monthly",
    amount: "$10.00",
    renewalDate: "Mar 23, 2026",
    notification: true,
  },
  {
    name: "ChatGPT Plus",
    category: "Productivity",
    dateAdded: "Mar 01, 2025",
    frequency: "Monthly",
    amount: "$20.00",
    renewalDate: "Mar 26, 2026",
    notification: true,
  },
  {
    name: "GitHub Copilot",
    category: "Developer Tools",
    dateAdded: "Sep 14, 2025",
    frequency: "Monthly",
    amount: "$10.00",
    renewalDate: "Mar 29, 2026",
    notification: true,
  },
  {
    name: "Amazon Prime",
    category: "Shopping",
    dateAdded: "Dec 01, 2024",
    frequency: "Yearly",
    amount: "$139.00",
    renewalDate: "Dec 01, 2026",
    notification: true,
  },
];

export const categoryDotClass: Record<string, string> = {
  Entertainment: "bg-purple-500",
  Music: "bg-sky-500",
  Productivity: "bg-amber-500",
  "Developer Tools": "bg-indigo-500",
  Shopping: "bg-rose-500",
};

export function getDaysLeft(renewalDateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const renewal = new Date(renewalDateStr);
  renewal.setHours(0, 0, 0, 0);
  return Math.round(
    (renewal.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
}
