"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { updateSubscription, type Subscription } from "@/lib/subscriptions";
import { toast } from "sonner";

interface EditSubscriptionDialogProps {
  subscription: Subscription;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubscriptionUpdated: (updated: Subscription[]) => void;
}

const categories = [
  "Entertainment",
  "Music",
  "Productivity",
  "Developer Tools",
  "Shopping",
  "Health & Fitness",
  "Education",
  "Cloud Storage",
  "Other",
];

const frequencies = ["Monthly", "Yearly", "Weekly", "Quarterly"];

export default function EditSubscriptionDialog({
  subscription,
  open,
  onOpenChange,
  onSubscriptionUpdated,
}: EditSubscriptionDialogProps) {
  const [frequency, setFrequency] = useState(subscription.frequency);

  function getNextRenewalDate(freq: string): Date {
    const now = new Date();
    const renewal = new Date(now);
    switch (freq) {
      case "Weekly":
        renewal.setDate(renewal.getDate() + 7);
        break;
      case "Monthly":
        renewal.setMonth(renewal.getMonth() + 1);
        break;
      case "Quarterly":
        renewal.setMonth(renewal.getMonth() + 3);
        break;
      case "Yearly":
        renewal.setFullYear(renewal.getFullYear() + 1);
        break;
      default:
        renewal.setMonth(renewal.getMonth() + 1);
    }
    return renewal;
  }

  function formatDate(date: Date): string {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const freq = formData.get("frequency") as string;
    const renewalDate = getNextRenewalDate(freq);

    const updatedSub: Subscription = {
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      amount: `$${parseFloat(formData.get("amount") as string).toFixed(2)}`,
      frequency: freq,
      renewalDate: formatDate(renewalDate),
      dateAdded: subscription.dateAdded,
      notification: subscription.notification,
    };

    try {
      const updated = updateSubscription(subscription.name, updatedSub);
      onOpenChange(false);
      onSubscriptionUpdated(updated);
      toast.success(`${updatedSub.name} updated successfully`);
    } catch {
      toast.error("Failed to update subscription");
    }
  }

  const rawAmount = parseFloat(subscription.amount.replace(/[^0-9.]/g, ""));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-visible p-0 sm:max-w-2xl">
        <DialogHeader className="mb-0 border-b px-6 py-4">
          <DialogTitle>Edit Subscription</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col-reverse md:flex-row">
            {/* Left panel — info + actions */}
            <div className="flex flex-col justify-between md:w-80 md:border-r">
              <div className="flex-1 grow">
                <div className="border-t p-6 md:border-none">
                  <div className="flex items-center space-x-3">
                    <div className="inline-flex shrink-0 items-center justify-center rounded-sm bg-muted p-3">
                      <Pencil
                        className="size-5 text-foreground"
                        aria-hidden={true}
                      />
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="text-sm font-medium text-foreground">
                        Edit Subscription
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Update subscription details
                      </p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <h4 className="text-sm font-medium text-foreground">
                    Details
                  </h4>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Modify the subscription info to keep your billing cycle
                    accurate and up to date.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t p-4">
                <DialogClose asChild>
                  <Button type="button" variant="ghost">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" size="sm">
                  Save
                </Button>
              </div>
            </div>

            {/* Right panel — form fields */}
            <div className="flex-1 space-y-6 p-6 md:px-6 md:pb-8 md:pt-6">
              {/* 1. Name */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="inline-flex size-6 items-center justify-center rounded-sm bg-muted text-sm text-foreground">
                    1
                  </div>
                  <Label
                    htmlFor="edit-name"
                    className="text-sm font-medium text-foreground"
                  >
                    Subscription name
                  </Label>
                </div>
                <Input
                  id="edit-name"
                  name="name"
                  defaultValue={subscription.name}
                  placeholder="e.g. Netflix, Spotify…"
                  required
                />
              </div>

              {/* 2. Category */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="inline-flex size-6 items-center justify-center rounded-sm bg-muted text-sm text-foreground">
                    2
                  </div>
                  <Label
                    htmlFor="edit-category"
                    className="text-sm font-medium text-foreground"
                  >
                    Category
                  </Label>
                </div>
                <Select defaultValue={subscription.category} name="category">
                  <SelectTrigger id="edit-category" className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 3. Amount + Frequency */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="inline-flex size-6 items-center justify-center rounded-sm bg-muted text-sm text-foreground">
                    3
                  </div>
                  <Label className="text-sm font-medium text-foreground">
                    Amount & frequency
                  </Label>
                </div>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="edit-amount"
                      name="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      defaultValue={rawAmount}
                      placeholder="9.99"
                      className="pl-7"
                      required
                    />
                  </div>
                  <Select
                    defaultValue={subscription.frequency}
                    name="frequency"
                    onValueChange={setFrequency}
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencies.map((f) => (
                        <SelectItem key={f} value={f}>
                          {f}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 4. Next renewal date (auto-computed) */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="inline-flex size-6 items-center justify-center rounded-sm bg-muted text-sm text-foreground">
                    4
                  </div>
                  <Label className="text-sm font-medium text-foreground">
                    Next renewal date
                  </Label>
                </div>
                <div className="flex h-9 items-center rounded-md border bg-muted/50 px-3 text-sm text-foreground">
                  {formatDate(getNextRenewalDate(frequency))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Automatically set based on frequency.
                </p>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
