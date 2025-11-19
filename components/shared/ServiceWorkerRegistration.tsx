"use client";

import { useEffect } from "react";
import { registerServiceWorker } from "@/lib/sw-register";

/**
 * Component to register service worker on mount.
 * Should be included in the root layout.
 */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return null;
}
