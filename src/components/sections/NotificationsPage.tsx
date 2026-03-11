"use client";

import { useState } from "react";
import {
  Bell,
  BellOff,
  ExternalLink,
  Loader2,
  Mail,
  Send,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
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
import { type Subscription } from "@/lib/subscriptions";

interface NotificationsPageProps {
  subscriptions: Subscription[];
  notifications: Record<string, boolean>;
  toggleNotification: (name: string) => void;
}

const methods = [
  {
    id: "push",
    label: "Push Notifications",
    description: "Receive alerts directly on your device",
    icon: Smartphone,
  },
  {
    id: "email",
    label: "Email",
    description: "Get notified via your registered email",
    icon: Mail,
  },
];

export default function NotificationsPage({
  subscriptions,
  notifications,
  toggleNotification,
}: NotificationsPageProps) {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    push: true,
    email: true,
  });

  const [threshold, setThreshold] = useState("3");

  const [sending, setSending] = useState(false);
  const [emailResult, setEmailResult] = useState<{
    success: boolean;
    previewUrl?: string;
    error?: string;
  } | null>(null);

  const toggle = (id: string) =>
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));

  async function sendDemoEmail() {
    setSending(true);
    setEmailResult(null);

    const enabledSubs = subscriptions.filter(
      (s) => notifications[s.name] ?? true,
    );

    try {
      const res = await fetch("/api/send-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriptions: enabledSubs.map((s) => ({
            name: s.name,
            amount: s.amount,
            renewalDate: s.renewalDate,
            frequency: s.frequency,
          })),
          threshold,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setEmailResult({ success: true, previewUrl: data.previewUrl });
      } else {
        setEmailResult({
          success: false,
          error: data.error || "Unknown error",
        });
      }
    } catch {
      setEmailResult({
        success: false,
        error: "Network error — is the dev server running?",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-8">
      <section>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-balance text-lg font-semibold text-foreground">
              Notification Method
            </h3>
            <p className="text-pretty mt-1 text-sm text-muted-foreground">
              Choose how you want to be notified about upcoming renewals and
              billing alerts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Select value={threshold} onValueChange={setThreshold}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Heads-up before" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="1">1 day before</SelectItem>
                <SelectItem value="3">3 days before</SelectItem>
                <SelectItem value="5">5 days before</SelectItem>
                <SelectItem value="7">1 week before</SelectItem>
                <SelectItem value="14">2 weeks before</SelectItem>
                <SelectItem value="30">1 month before</SelectItem>
              </SelectContent>
            </Select>

            <Button
              size="sm"
              variant="outline"
              className="cursor-pointer gap-1.5"
              disabled={sending}
              onClick={sendDemoEmail}
            >
              {sending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              {sending ? "Sending…" : "Send Demo"}
            </Button>
          </div>
        </div>

        {emailResult && (
          <div className="mt-4">
            {emailResult.success ? (
              <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
                <Mail className="size-4 text-green-600 dark:text-green-400" />
                <AlertTitle className="text-green-800 dark:text-green-300">
                  Demo email sent successfully!
                </AlertTitle>
                <AlertDescription className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <a
                    href={emailResult.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium underline underline-offset-4 hover:text-green-900 dark:hover:text-green-200"
                  >
                    Open preview in Ethereal
                    <ExternalLink className="size-3" />
                  </a>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <AlertTitle>Failed to send demo email</AlertTitle>
                <AlertDescription>{emailResult.error}</AlertDescription>
              </Alert>
            )}
          </div>
        )}
        <div className="mt-4 space-y-3">
          {methods.map((method) => {
            const Icon = method.icon;
            const isOn = enabled[method.id] ?? false;
            return (
              <div
                key={method.id}
                className="flex items-center justify-between rounded-lg border bg-card p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Icon className="size-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{method.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {method.description}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={isOn}
                  onCheckedChange={() => toggle(method.id)}
                  className="cursor-pointer"
                />
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-balance text-lg font-semibold text-foreground">
              Monitored Subscriptions
            </h3>
            <p className="text-pretty mt-1 text-sm text-muted-foreground">
              Manage which subscriptions you receive renewal alerts for.
            </p>
          </div>
        </div>
        <div className="mt-4 rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="border-b hover:bg-transparent">
                <TableHead className="h-12 px-4 font-medium">NAME</TableHead>
                <TableHead className="h-12 px-4 font-medium">
                  FREQUENCY
                </TableHead>
                <TableHead className="h-12 px-4 text-right font-medium">
                  AMOUNT
                </TableHead>
                <TableHead className="h-12 px-4 font-medium">
                  RENEWAL DATE
                </TableHead>
                <TableHead className="h-12 px-4 text-right font-medium">
                  ALERTS
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((sub) => {
                const isOn = notifications[sub.name] ?? true;
                return (
                  <TableRow key={sub.name} className="hover:bg-muted/50">
                    <TableCell className="h-14 px-4 font-medium">
                      {sub.name}
                    </TableCell>
                    <TableCell className="h-14 px-4 text-sm text-muted-foreground">
                      {sub.frequency}
                    </TableCell>
                    <TableCell className="tabular-nums h-14 px-4 text-right font-mono text-sm font-semibold text-green-600 dark:text-green-400">
                      {sub.amount}
                    </TableCell>
                    <TableCell className="h-14 px-4 text-sm text-muted-foreground">
                      {sub.renewalDate}
                    </TableCell>
                    <TableCell className="h-14 px-4 text-right">
                      <Switch
                        checked={isOn}
                        onCheckedChange={() => toggleNotification(sub.name)}
                        className="cursor-pointer"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
