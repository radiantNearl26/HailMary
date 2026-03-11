"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { subscriptions, categoryDotClass } from "@/lib/subscriptions";

function getCategoryBadge(category: string) {
  switch (category) {
    case "Entertainment":
      return (
        <Badge
          variant="outline"
          className="border-0 bg-purple-500/15 text-purple-700 hover:bg-purple-500/25 dark:bg-purple-500/10 dark:text-purple-300 dark:hover:bg-purple-500/20"
        >
          {category}
        </Badge>
      );
    case "Music":
      return (
        <Badge
          variant="outline"
          className="border-0 bg-sky-500/15 text-sky-700 hover:bg-sky-500/25 dark:bg-sky-500/10 dark:text-sky-300 dark:hover:bg-sky-500/20"
        >
          {category}
        </Badge>
      );
    case "Productivity":
      return (
        <Badge
          variant="outline"
          className="border-0 bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/20"
        >
          {category}
        </Badge>
      );
    case "Developer Tools":
      return (
        <Badge
          variant="outline"
          className="border-0 bg-indigo-500/15 text-indigo-700 hover:bg-indigo-500/25 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-500/20"
        >
          {category}
        </Badge>
      );
    case "Shopping":
      return (
        <Badge
          variant="outline"
          className="border-0 bg-rose-500/15 text-rose-700 hover:bg-rose-500/25 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20"
        >
          {category}
        </Badge>
      );
    default:
      return <Badge variant="outline">{category}</Badge>;
  }
}

export default function Table03() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredData = subscriptions.filter((item) => {
    return selectedCategory === "all" || item.category === selectedCategory;
  });

  const uniqueCategories = Array.from(
    new Set(subscriptions.map((item) => item.category)),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-balance text-lg font-semibold text-foreground">
            All Subscriptions
          </h3>
          <p className="text-pretty mt-1 text-sm text-muted-foreground">
            View and filter your subscriptions by category to track renewals and
            monthly spending.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent position="popper" className="w-[200px]">
              <SelectGroup>
                <SelectLabel>Categories</SelectLabel>
                <SelectItem value="all">
                  <span className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-muted-foreground/40" />
                    All Categories
                  </span>
                </SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                {uniqueCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    <span className="flex items-center gap-2">
                      <span
                        className={`size-2 rounded-full ${
                          categoryDotClass[category] ?? "bg-muted-foreground"
                        }`}
                      />
                      {category}
                    </span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-b hover:bg-transparent">
              <TableHead className="h-12 px-4 font-medium">NAME</TableHead>
              <TableHead className="h-12 px-4 font-medium">CATEGORY</TableHead>
              <TableHead className="h-12 px-4 font-medium">
                DATE ADDED
              </TableHead>
              <TableHead className="h-12 px-4 font-medium">FREQUENCY</TableHead>
              <TableHead className="h-12 px-4 text-right font-medium">
                AMOUNT
              </TableHead>
              <TableHead className="h-12 px-4 text-right font-medium">
                RENEWAL DATE
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <TableRow key={item.name} className="hover:bg-muted/50">
                  <TableCell className="h-14 px-4 font-medium">
                    {item.name}
                  </TableCell>
                  <TableCell className="h-14 px-4">
                    {getCategoryBadge(item.category)}
                  </TableCell>
                  <TableCell className="h-14 px-4 text-sm text-muted-foreground">
                    {item.dateAdded}
                  </TableCell>
                  <TableCell className="h-14 px-4 text-sm text-muted-foreground">
                    {item.frequency}
                  </TableCell>
                  <TableCell className="tabular-nums h-14 px-4 text-right font-mono text-sm font-semibold text-green-600 dark:text-green-400">
                    {item.amount}
                  </TableCell>
                  <TableCell className="h-14 px-4 text-right text-sm text-muted-foreground">
                    {item.renewalDate}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No subscriptions found matching the selected filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
