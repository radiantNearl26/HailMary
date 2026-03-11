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

const STORAGE_KEY = "sub-all";

/** Read all subscriptions — defaults + any user-added ones persisted in localStorage */
export function getAllSubscriptions(): Subscription[] {
  if (typeof window === "undefined") return subscriptions;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored) as Subscription[];
  return subscriptions;
}

/** Persist a new subscription and return the updated list */
export function addSubscription(sub: Subscription): Subscription[] {
  const current = getAllSubscriptions();
  const updated = [...current, sub];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

/** Update a subscription by original name and return the updated list */
export function updateSubscription(
  originalName: string,
  updated: Subscription,
): Subscription[] {
  const current = getAllSubscriptions();
  const list = current.map((s) => (s.name === originalName ? updated : s));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return list;
}

/** Delete a subscription by name and return the updated list */
export function deleteSubscription(name: string): Subscription[] {
  const current = getAllSubscriptions();
  const list = current.filter((s) => s.name !== name);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return list;
}
