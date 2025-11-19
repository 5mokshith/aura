"use client";

import { useEffect } from "react";
import { useReportWebVitals } from "next/web-vitals";
import { reportWebVitals, rateMetric } from "@/lib/performance";

/**
 * Component to report Web Vitals metrics
 * Automatically tracks Core Web Vitals and reports them
 */
export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    const rating = rateMetric(metric.name, metric.value);

    reportWebVitals({
      name: metric.name,
      value: metric.value,
      rating,
      delta: metric.delta,
    });
  });

  // Monitor long tasks in development
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const { monitorLongTasks } = require("@/lib/performance");
      monitorLongTasks();
    }
  }, []);

  return null;
}
