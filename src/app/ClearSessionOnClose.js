"use client";

import { useEffect } from "react";

export default function ClearSessionOnClose() {
  useEffect(() => {
    // Only run on client
    if (typeof window !== "undefined") {
      // If keepSignedIn is NOT set, clear persisted Redux state and sensitive localStorage on tab close
      const clearOnClose = () => {
        if (!localStorage.getItem("keepSignedIn")) {
          // Clear redux-persist state
          localStorage.removeItem("persist:root");
          // Clear sensitive data
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("features");
          localStorage.removeItem("subFeatures");
        }
      };
      window.addEventListener("unload", clearOnClose);
      return () => window.removeEventListener("unload", clearOnClose);
    }
  }, []);
  return null;
}