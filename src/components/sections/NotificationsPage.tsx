"use client";

import { useState } from "react";
import { Bell, BellOff, Mail, MessageSquare, Smartphone } from "lucide-react";
import { Switch } from "@/components/ui/switch";
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
import { subscriptions } from "@/lib/subscriptions";

interface NotificationsPageProps {
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
  {
    id: "sms",
    label: "SMS",
    description: "Receive text message alerts on your phone",
    icon: MessageSquare,
  },
];

export default function NotificationsPage({
  notifications,
  toggleNotification,
}: NotificationsPageProps) {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    push: true,
    email: true,
    sms: false,
  });

  const [threshold, setThreshold] = useState("3");

  const toggle = (id: string) =>
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));

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
        </div>
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
