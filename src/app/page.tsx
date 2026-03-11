"use client";

import { useCallback, useSyncExternalStore, useState } from "react";
import { Bell, ChartNoAxesCombined, HomeIcon, Plus } from "lucide-react";
import { Dock, DockIcon } from "@/components/ui/dock";
import { Button } from "@/components/ui/button";
import OverviewPage from "@/components/sections/OverviewPage";
import NotificationsPage from "@/components/sections/NotificationsPage";
import InsightsPage from "@/components/sections/InsightsPage";
import AddSubscriptionDialog from "@/components/AddSubscriptionDialog";
import { getAllSubscriptions, type Subscription } from "@/lib/subscriptions";

const sections = [
  {
    label: "Overview",
    icon: HomeIcon,
    heading: "Overview",
    description: "Manage your subscriptions",
  },
  {
    label: "Notifications",
    icon: Bell,
    heading: "Notifications",
    description: "Stay updated on billing alerts and reminders",
  },
  {
    label: "Insights",
    icon: ChartNoAxesCombined,
    heading: "Insights",
    description: "Analyse your spending trends and patterns",
  },
];

export default function Home() {
  const [activeLabel, setActiveLabel] = useState("Overview");
  const activeSection =
    sections.find((s) => s.label === activeLabel) ?? sections[0];

  const [subs, setSubs] = useState<Subscription[]>(() => getAllSubscriptions());

  const defaultNotifications = Object.fromEntries(
    subs.map((s) => [s.name, s.notification]),
  );

  const subscribe = useCallback((onChange: () => void) => {
    const handler = (e: StorageEvent) => {
      if (e.key === "sub-notifications") onChange();
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const getSnapshot = useCallback(() => {
    return localStorage.getItem("sub-notifications") ?? "";
  }, []);

  const getServerSnapshot = useCallback(() => "", []);

  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const notifications: Record<string, boolean> = raw
    ? (JSON.parse(raw) as Record<string, boolean>)
    : defaultNotifications;

  const [, forceUpdate] = useState(0);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const handleSubscriptionAdded = (updated: Subscription[]) => {
    setSubs(updated);
  };

  const toggleNotification = (name: string) => {
    const next = { ...notifications, [name]: !notifications[name] };
    localStorage.setItem("sub-notifications", JSON.stringify(next));
    forceUpdate((n) => n + 1);
  };

  const renderPage = () => {
    switch (activeLabel) {
      case "Overview":
        return (
          <OverviewPage
            subscriptions={subs}
            notifications={notifications}
            toggleNotification={toggleNotification}
            onSubscriptionsChange={setSubs}
          />
        );
      case "Notifications":
        return (
          <NotificationsPage
            subscriptions={subs}
            notifications={notifications}
            toggleNotification={toggleNotification}
          />
        );
      case "Insights":
        return <InsightsPage subscriptions={subs} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative h-svh overflow-hidden bg-muted/30">
      <div className="flex h-full flex-col p-6 md:p-8">
        <div className="mt-6 flex-1 overflow-y-auto pb-28 pr-1">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              {activeSection.heading}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {activeSection.description}
            </p>
          </div>

          {renderPage()}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
        <Dock
          className="pointer-events-auto"
          iconSize={42}
          iconMagnification={64}
          direction="middle"
        >
          {sections.slice(0, 2).map((item) => {
            const Icon = item.icon;
            const isActive = item.label === activeLabel;
            return (
              <DockIcon key={item.label}>
                <div className="group relative flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-12 cursor-pointer rounded-full hover:bg-black/10 dark:hover:bg-white/15"
                    aria-label={item.label}
                    onClick={() => setActiveLabel(item.label)}
                  >
                    <Icon
                      className={isActive ? "size-4 fill-current" : "size-4"}
                    />
                  </Button>
                  <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1 text-xs text-background opacity-0 transition-opacity group-hover:opacity-100">
                    {item.label}
                  </span>
                </div>
              </DockIcon>
            );
          })}

          {/* Add Subscription — center, blue circle */}
          <DockIcon>
            <div className="group relative flex items-center justify-center">
              <Button
                variant="ghost"
                size="icon"
                className="size-12 cursor-pointer rounded-full bg-blue-500/15 text-blue-600 hover:bg-blue-500/25 dark:bg-blue-400/15 dark:text-blue-400 dark:hover:bg-blue-400/25"
                aria-label="Add Subscription"
                onClick={() => setAddDialogOpen(true)}
              >
                <Plus className="size-4" />
              </Button>
              <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1 text-xs text-background opacity-0 transition-opacity group-hover:opacity-100">
                Add Subscription
              </span>
            </div>
          </DockIcon>

          {sections.slice(2).map((item) => {
            const Icon = item.icon;
            const isActive = item.label === activeLabel;
            return (
              <DockIcon key={item.label}>
                <div className="group relative flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-12 cursor-pointer rounded-full hover:bg-black/10 dark:hover:bg-white/15"
                    aria-label={item.label}
                    onClick={() => setActiveLabel(item.label)}
                  >
                    <Icon
                      className={isActive ? "size-4 fill-current" : "size-4"}
                    />
                  </Button>
                  <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1 text-xs text-background opacity-0 transition-opacity group-hover:opacity-100">
                    {item.label}
                  </span>
                </div>
              </DockIcon>
            );
          })}
        </Dock>
      </div>

      <AddSubscriptionDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        showTrigger={false}
        onSubscriptionAdded={handleSubscriptionAdded}
      />
    </div>
  );
}
