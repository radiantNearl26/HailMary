"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Subscription, categoryDotClass } from "@/lib/subscriptions";

function parseAmount(amount: string): number {
  return parseFloat(amount.replace(/[^0-9.]/g, ""));
}

function getMonthlyEquivalent(sub: Subscription): number {
  const raw = parseAmount(sub.amount);
  if (sub.frequency === "Yearly") return raw / 12;
  return raw;
}

// Map Tailwind bg classes to CSS color values for the pie chart
const categoryChartColor: Record<string, string> = {
  "bg-purple-500": "oklch(0.627 0.265 303.9)",
  "bg-sky-500": "oklch(0.685 0.169 237.323)",
  "bg-amber-500": "oklch(0.769 0.188 70.08)",
  "bg-indigo-500": "oklch(0.585 0.233 277.117)",
  "bg-rose-500": "oklch(0.645 0.246 16.439)",
  "bg-gray-500": "oklch(0.551 0.014 247.839)",
};

interface InsightsPageProps {
  subscriptions: Subscription[];
}

export default function InsightsPage({ subscriptions }: InsightsPageProps) {
  const {
    stats,
    categoryData,
    distTotalValue,
    chartConfig,
    chartData,
    totalMonthly,
    monthlyExpenditure,
  } = useMemo(() => {
    const totalSubscriptions = subscriptions.length;
    const monthlyExp = subscriptions.reduce(
      (sum, s) => sum + getMonthlyEquivalent(s),
      0,
    );

    const lastMonthTotal = Math.max(totalSubscriptions - 1, 0);
    const lastMonthExpenditure = monthlyExp * 0.92;

    const totalDelta =
      lastMonthTotal > 0
        ? ((totalSubscriptions - lastMonthTotal) / lastMonthTotal) * 100
        : 0;
    const expDelta =
      lastMonthExpenditure > 0
        ? ((monthlyExp - lastMonthExpenditure) / lastMonthExpenditure) * 100
        : 0;

    const computedStats = [
      {
        title: "Total Subscriptions",
        value: totalSubscriptions,
        delta: parseFloat(totalDelta.toFixed(1)),
        lastMonth: lastMonthTotal,
        positive: totalDelta >= 0,
        format: (v: number) => v.toString(),
        lastFormat: (v: number) => v.toString(),
      },
      {
        title: "Monthly Expenditure",
        value: monthlyExp,
        delta: parseFloat(expDelta.toFixed(1)),
        lastMonth: lastMonthExpenditure,
        positive: expDelta <= 0,
        format: (v: number) => `$${v.toFixed(2)}`,
        lastFormat: (v: number) => `$${v.toFixed(2)}`,
      },
    ];

    const catData = Object.entries(
      subscriptions.reduce(
        (acc, sub) => {
          const monthly = getMonthlyEquivalent(sub);
          if (!acc[sub.category]) {
            acc[sub.category] = { count: 0, value: 0 };
          }
          acc[sub.category].count += 1;
          acc[sub.category].value += monthly;
          return acc;
        },
        {} as Record<string, { count: number; value: number }>,
      ),
    )
      .map(([name, data]) => ({
        id: name.toLowerCase().replace(/\s+/g, "-"),
        name,
        count: data.count,
        value: parseFloat(data.value.toFixed(2)),
        color: categoryDotClass[name] || "bg-gray-500",
      }))
      .sort((a, b) => b.value - a.value);

    const distTotal = catData.reduce((sum, c) => sum + c.value, 0);

    const config: ChartConfig = Object.fromEntries([
      ["value", { label: "Monthly" }],
      ...catData.map((cat) => [
        cat.id,
        {
          label: cat.name,
          color: categoryChartColor[cat.color] || "oklch(0.551 0.014 247.839)",
        },
      ]),
    ]);

    const cData = catData.map((cat) => ({
      category: cat.id,
      value: cat.value,
      fill: `var(--color-${cat.id})`,
    }));

    const total = cData.reduce((sum, d) => sum + d.value, 0);

    return {
      stats: computedStats,
      categoryData: catData,
      distTotalValue: distTotal,
      chartConfig: config,
      chartData: cData,
      totalMonthly: total,
      monthlyExpenditure: monthlyExp,
    };
  }, [subscriptions]);

  return (
    <div className="space-y-8">
      <section>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {stats.map((stat, i) => (
            <Card key={i} className="shadow-none">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-2.5">
                <span className="text-2xl font-medium tracking-tight text-foreground">
                  {stat.format(stat.value)}
                </span>
                <Badge
                  variant="outline"
                  className={cn({
                    "text-green-500": stat.positive,
                    "text-destructive": !stat.positive,
                  })}
                >
                  {stat.delta > 0 ? <ArrowUp /> : <ArrowDown />}
                  {Math.abs(stat.delta)}%
                </Badge>
              </CardContent>
              <CardFooter className="mt-2 border-t pt-2.5 text-xs text-muted-foreground">
                Vs last month:{" "}
                <span className="ml-1 font-medium text-foreground">
                  {stat.lastFormat(stat.lastMonth)}
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Expense Distribution</CardTitle>
            <CardDescription>
              Monthly spending breakdown by category.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-8 md:flex-row">
              {/* Donut chart */}
              <div className="w-full md:w-1/2">
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square max-h-[250px]"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="category"
                      innerRadius={60}
                      strokeWidth={5}
                    >
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                <tspan
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  className="fill-foreground text-3xl font-bold"
                                >
                                  ${totalMonthly.toFixed(0)}
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) + 24}
                                  className="fill-muted-foreground"
                                >
                                  per month
                                </tspan>
                              </text>
                            );
                          }
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </div>

              {/* Category list */}
              <div className="w-full space-y-4 md:w-1/2">
                {categoryData.map((cat) => (
                  <div key={cat.id} className="flex items-center gap-3">
                    <div
                      className={`size-3 shrink-0 rounded-full ${cat.color}`}
                    />
                    <div className="flex flex-1 items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{cat.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {cat.count} subscription{cat.count !== 1 && "s"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          ${cat.value.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {Math.round((cat.value / distTotalValue) * 100)}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <ExpenseHistorySection monthlyExpenditure={monthlyExpenditure} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Expense History – last 24 months line chart                       */
/* ------------------------------------------------------------------ */

function generateExpenseHistory(baseMonthly: number) {
  const now = new Date();
  const data: { date: string; recurring: number; oneTime: number }[] = [];

  for (let i = 23; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;

    // Simulate slight variation around the base
    const seed = d.getFullYear() * 100 + d.getMonth();
    const jitter = (((seed * 9301 + 49297) % 233280) / 233280 - 0.5) * 0.15;
    const recurring = parseFloat((baseMonthly * (1 + jitter)).toFixed(2));

    // Occasional one-time purchases
    const hasOneTime = seed % 4 === 0;
    const oneTime = hasOneTime
      ? parseFloat(
          (10 + (((seed * 7121 + 13761) % 100000) / 100000) * 60).toFixed(2),
        )
      : 0;

    data.push({ date: label, recurring, oneTime });
  }
  return data;
}

const lineChartConfig = {
  amount: {
    label: "Amount",
  },
  recurring: {
    label: "Recurring",
    color: "var(--chart-1)",
  },
  oneTime: {
    label: "One-time",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

function ExpenseHistorySection({
  monthlyExpenditure,
}: {
  monthlyExpenditure: number;
}) {
  const expenseHistoryData = useMemo(
    () => generateExpenseHistory(monthlyExpenditure),
    [monthlyExpenditure],
  );

  const [activeLine, setActiveLine] = useState<"recurring" | "oneTime">(
    "recurring",
  );

  const totals = useMemo(
    () => ({
      recurring: expenseHistoryData.reduce((s, d) => s + d.recurring, 0),
      oneTime: expenseHistoryData.reduce((s, d) => s + d.oneTime, 0),
    }),
    [expenseHistoryData],
  );

  return (
    <section>
      <Card className="shadow-none py-4 sm:py-0">
        <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
            <CardTitle>Expense History</CardTitle>
            <CardDescription>
              Total spending over the last 24 months.
            </CardDescription>
          </div>
          <div className="flex">
            {(["recurring", "oneTime"] as const).map((key) => (
              <button
                key={key}
                data-active={activeLine === key}
                className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveLine(key)}
              >
                <span className="text-xs text-muted-foreground">
                  {lineChartConfig[key].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  $
                  {totals[key].toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </span>
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <ChartContainer
            config={lineChartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <LineChart
              accessibilityLayer
              data={expenseHistoryData}
              margin={{ left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={48}
                tickFormatter={(value) => {
                  const d = new Date(value);
                  return d.toLocaleDateString("en-US", {
                    month: "short",
                    year: "2-digit",
                  });
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[160px]"
                    nameKey="amount"
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })
                    }
                    formatter={(value) => `$${Number(value).toFixed(2)}`}
                  />
                }
              />
              <Line
                dataKey={activeLine}
                type="monotone"
                stroke={`var(--color-${activeLine})`}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </section>
  );
}
