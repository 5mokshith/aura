"use client";

import React, { useState } from "react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HistoryProvider, useHistory } from "@/contexts/HistoryContext";
import { HistoryList } from "@/components/history/HistoryList";
import { HistoryFilters } from "@/components/history/HistoryFilters";
import { PullToRefresh } from "@/components/shared/PullToRefresh";
import { History as HistoryIcon } from "lucide-react";

// Lazy load the modal for better performance
const TaskDetailModal = dynamic(
  () => import("@/components/history/TaskDetailModal").then((mod) => ({ default: mod.TaskDetailModal })),
  { ssr: false }
);

function HistoryPageContent() {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { refresh } = useHistory();

  const handleItemSelect = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsModalOpen(true);
  };

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setSelectedTaskId(null);
    }
  };

  const handleRefresh = async () => {
    await refresh();
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header - Responsive sizing */}
        <div className="flex items-center gap-2 sm:gap-3">
          <HistoryIcon className="h-6 w-6 sm:h-8 sm:w-8 text-primary shrink-0" />
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">History</h1>
            <p className="text-muted-foreground mt-0.5 sm:mt-1 text-sm sm:text-base">
              View and manage your past workflow executions
            </p>
          </div>
        </div>

        {/* Filters - Responsive layout */}
        <HistoryFilters />

        {/* HistoryList with Pull-to-Refresh - Responsive padding */}
        <div className="rounded-lg border-b border-card p-4 sm:p-6">
          <PullToRefresh onRefresh={handleRefresh} className="lg:pointer-events-none">
            <HistoryList onItemSelect={handleItemSelect} />
          </PullToRefresh>
        </div>

        {/* TaskDetailModal */}
        <TaskDetailModal
          taskId={selectedTaskId}
          open={isModalOpen}
          onOpenChange={handleModalClose}
        />
      </div>
    </DashboardLayout>
  );
}

export default function HistoryPage() {
  const { user, isLoading } = useSupabaseAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <HistoryProvider>
      <HistoryPageContent />
    </HistoryProvider>
  );
}
