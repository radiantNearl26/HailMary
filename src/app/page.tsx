"use client";

import { useCallback, useSyncExternalStore, useState } from "react";
import {
  Bell,
  ChartNoAxesCombined,
  HomeIcon,
  Plus,
  Settings,
} from "lucide-react";
import { Dock, DockIcon } from "@/components/ui/dock";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import OverviewPage from "@/components/sections/OverviewPage";
import NotificationsPage from "@/components/sections/NotificationsPage";
import InsightsPage from "@/components/sections/InsightsPage";
import SettingsPage from "@/components/sections/SettingsPage";
import AddSubscriptionPage from "@/components/sections/AddSubscriptionPage";
import { subscriptions } from "@/lib/subscriptions";

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
    label: "Add Subscription",
    icon: Plus,
    heading: "Add Subscription",
    description: "Track a new service or recurring payment",
  },
  {
    label: "Insights",
    icon: ChartNoAxesCombined,
    heading: "Insights",
    description: "Analyse your spending trends and patterns",
  },
  {
    label: "Settings",
    icon: Settings,
    heading: "Settings",
    description: "Configure your preferences and account details",
  },
];

export default function Home() {
  const [activeLabel, setActiveLabel] = useState("Overview");
  const activeSection =
    sections.find((s) => s.label === activeLabel) ?? sections[0];

  const defaultNotifications = Object.fromEntries(
    subscriptions.map((s) => [s.name, s.notification]),
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
            notifications={notifications}
            toggleNotification={toggleNotification}
          />
        );
      case "Notifications":
        return (
          <NotificationsPage
            notifications={notifications}
            toggleNotification={toggleNotification}
          />
        );
      case "Add Subscription":
        return <AddSubscriptionPage />;
      case "Insights":
        return <InsightsPage />;
      case "Settings":
        return <SettingsPage />;
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
        <TooltipProvider>
          <Dock
            className="pointer-events-auto"
            iconSize={42}
            iconMagnification={64}
            direction="middle"
          >
            {sections.map((item) => {
              const Icon = item.icon;
              const isActive = item.label === activeLabel;
              return (
                <DockIcon key={item.label}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-12 cursor-pointer rounded-full hover:bg-black/10 dark:hover:bg-white/15"
                        aria-label={item.label}
                        onClick={() => setActiveLabel(item.label)}
                      >
                        <Icon
                          className={
                            isActive ? "size-4 fill-current" : "size-4"
                          }
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" sideOffset={6}>
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </DockIcon>
              );
            })}
          </Dock>
        </TooltipProvider>
      </div>
    </div>
  );
}
