"use client";

import dynamic from "next/dynamic";
import { LoadingSpinner } from "./LoadingSpinner";

/**
 * Dynamically imported modal components for code splitting
 * These heavy components are only loaded when needed
 */

// Loading fallback for modals
const ModalLoadingFallback = () => (
  <div className="flex items-center justify-center p-8">
    <LoadingSpinner size="lg" />
  </div>
);

// TaskDetailModal - loaded on demand
export const DynamicTaskDetailModal = dynamic(
  () =>
    import("@/components/history/TaskDetailModal").then(
      (mod) => mod.TaskDetailModal
    ),
  {
    loading: ModalLoadingFallback,
    ssr: false,
  }
);

// KeyboardShortcutsModal - loaded on demand
export const DynamicKeyboardShortcutsModal = dynamic(
  () =>
    import("@/components/command/KeyboardShortcutsModal").then(
      (mod) => mod.KeyboardShortcutsModal
    ),
  {
    loading: ModalLoadingFallback,
    ssr: false,
  }
);

// QuickActionParameterModal - loaded on demand
export const DynamicQuickActionParameterModal = dynamic(
  () =>
    import("@/components/layout/QuickActionParameterModal").then(
      (mod) => mod.QuickActionParameterModal
    ),
  {
    loading: ModalLoadingFallback,
    ssr: false,
  }
);
