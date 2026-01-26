"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Dashboard from "@/components/Dashboard";
import { DashboardData } from "@/lib/graph-loader";
import { ProfileProvider, useProfile } from "@/context/ProfileContext";

// A dedicated preview component that listens for messages from the parent window
function PreviewContent({ data }: { data: DashboardData }) {
  const { updateProfile } = useProfile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Listen for profile updates from the Studio Client
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "UPDATE_PROFILE") {
        updateProfile(event.data.profile);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [updateProfile]);

  if (!mounted) return null;

  return <Dashboard data={data} hideNav={true} />;
}

export default function StudioPreviewPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    // Initial data fetch or passed via some mechanism?
    // Let's assume we fetch it or the parent provides it via postMessage initially too
    const handleInitialData = (event: MessageEvent) => {
      if (event.data?.type === "INITIAL_DATA") {
        setData(event.data.data);
      }
    };
    window.addEventListener("message", handleInitialData);

    // Tell parent we are ready
    window.parent.postMessage({ type: "PREVIEW_READY" }, "*");

    return () => window.removeEventListener("message", handleInitialData);
  }, []);

  if (!data)
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <ProfileProvider>
      <PreviewContent data={data} />
    </ProfileProvider>
  );
}
