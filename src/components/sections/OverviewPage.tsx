"use client";

import { Bell } from "lucide-react";
import Table03 from "@/components/table-03";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { subscriptions, getDaysLeft } from "@/lib/subscriptions";

interface OverviewPageProps {
  notifications: Record<string, boolean>;
  toggleNotification: (name: string) => void;
}

const serviceIcons: Record<string, React.ReactNode> = {
  Netflix: (
    <svg
      viewBox="0 0 111 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-auto"
    >
      <path
        d="M105.062 0.00170898L90.7908 23.7972L90.7822 0.00170898H79.5098V29.3702C82.6226 29.9259 85.784 30.1765 88.9473 30.1189C90.6885 30.1189 92.0957 29.5713 93.0049 27.9795L108.204 0.00170898H105.062ZM0 0L10.8701 17.5684V0H0ZM26.0117 17.3428L15.1416 0.00170898V29.625C18.2856 29.8311 21.4404 29.9001 24.5918 29.832C25.5977 29.8063 26.3623 29.0386 26.3623 28.0264V17.3428H26.0117ZM38.8389 12.667H49.624V7.72217H38.8389V4.94873H50.5742V0.00390625H33.5742V29.625H50.916V24.6802H38.8389V12.667ZM68.4883 0L63.2246 11.2192L57.9336 0H52.1504L61.0498 17.7578V29.625H65.3711V17.7578L74.2539 0H68.4883Z"
        fill="#E50914"
      />
    </svg>
  ),
  Spotify: (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="size-6"
    >
      <path
        fill="#1DB954"
        d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
      />
    </svg>
  ),
  "YouTube Premium": (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="size-6"
    >
      <path
        fill="#FF0000"
        d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
      />
    </svg>
  ),
  "Notion Plus": (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="size-6"
    >
      <path
        fill="currentColor"
        d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"
      />
    </svg>
  ),
  "ChatGPT Plus": (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="size-6"
    >
      <path
        fill="currentColor"
        d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0L4.252 14.13A4.504 4.504 0 0 1 2.34 7.896zm16.597 3.855l-5.843-3.372L15.119 7.2a.076.076 0 0 1 .071 0l4.566 2.637a4.504 4.504 0 0 1-.676 8.123V12.38a.795.795 0 0 0-.383-.629zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.071.071 0 0 1 .028-.061l4.566-2.632a4.505 4.505 0 0 1 6.675 4.47zM8.217 12.42l-2.02-1.167a.08.08 0 0 1-.038-.057V5.619a4.504 4.504 0 0 1 7.375-3.453l-.142.08L8.614 5.005a.795.795 0 0 0-.397.68zm1.097-2.365l2.602-1.5 2.607 1.5v2.993l-2.597 1.5-2.607-1.5z"
      />
    </svg>
  ),
  "GitHub Copilot": (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="size-6"
    >
      <path
        fill="currentColor"
        d="M12 0C5.373 0 0 5.373 0 12c0 5.303 3.438 9.8 8.207 11.387.6.113.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"
      />
    </svg>
  ),
};

const UPCOMING_THRESHOLD_DAYS = 30;

export default function OverviewPage({
  notifications,
  toggleNotification,
}: OverviewPageProps) {
  const upcomingBills = subscriptions
    .map((s) => ({ ...s, daysLeft: getDaysLeft(s.renewalDate) }))
    .filter((s) => s.daysLeft >= 0 && s.daysLeft <= UPCOMING_THRESHOLD_DAYS)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  return (
    <div className="space-y-8">
      <section>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-balance text-lg font-semibold text-foreground">
              Upcoming Bills
            </h3>
            <p className="text-pretty mt-1 text-sm text-muted-foreground">
              Track subscriptions due soon and stay on top of your upcoming
              renewal dates.
            </p>
          </div>
        </div>
        <div className="mt-4 overflow-x-auto pb-2">
          <div className="flex min-w-max gap-4">
            {upcomingBills.map((bill) => {
              const isUrgent = bill.daysLeft <= 5;
              const notifEnabled = notifications[bill.name] ?? true;
              return (
                <Card key={bill.name} className="w-[280px]">
                  <CardHeader className="flex flex-row items-center gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-[30%] bg-muted">
                      {serviceIcons[bill.name] ?? (
                        <span className="text-lg font-bold">
                          {bill.name[0]}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-0.5">
                      <CardTitle>{bill.name}</CardTitle>
                      <CardDescription>
                        <span
                          className={
                            isUrgent ? "text-red-500" : "text-muted-foreground"
                          }
                        >
                          {bill.daysLeft === 0
                            ? "Due today"
                            : bill.daysLeft === 1
                              ? "Due tomorrow"
                              : `${bill.daysLeft} days left`}
                        </span>
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 size-8 cursor-pointer text-muted-foreground hover:text-foreground"
                      aria-label={
                        notifEnabled
                          ? "Disable notifications"
                          : "Enable notifications"
                      }
                      onClick={() => toggleNotification(bill.name)}
                    >
                      <Bell
                        className={`size-4 ${
                          notifEnabled ? "fill-current" : ""
                        }`}
                      />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-2xl font-bold">{bill.amount}</div>
                    <p className="text-sm text-muted-foreground">
                      Renews on{" "}
                      <span className="font-medium text-foreground">
                        {bill.renewalDate}
                      </span>
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section>
        <div className="mt-4">
          <Table03 />
        </div>
      </section>
    </div>
  );
}
