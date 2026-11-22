import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { api, errorMessage, isUnauthorized } from "../../lib/api";
import { PanelLayout } from "./PanelLayout";

type Status = { state: "checking" } | { state: "in" } | { state: "out" } | { state: "error"; message: string };

/**
 * UI guard only. The real protection is server-side: every /api route that
 * reads drafts or writes content verifies the signed session cookie itself.
 */
export function RequireAuth() {
  const location = useLocation();
  const [status, setStatus] = useState<Status>({ state: "checking" });

  useEffect(() => {
    const controller = new AbortController();
    api
      .me(controller.signal)
      .then((r) => setStatus({ state: r.authenticated ? "in" : "out" }))
      .catch((err) => {
        if (controller.signal.aborted) return;
        setStatus(isUnauthorized(err) ? { state: "out" } : { state: "error", message: errorMessage(err) });
      });
    return () => controller.abort();
  }, []);

  if (status.state === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-theme text-sm text-muted" role="status">
        Checking your session…
      </div>
    );
  }
  if (status.state === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-theme p-6">
        <p role="alert" className="max-w-md rounded-2xl border border-theme bg-card p-6 text-sm text-theme">
          {status.message}
        </p>
      </div>
    );
  }
  if (status.state === "out") {
    return <Navigate to="/panel/login" replace state={{ from: location.pathname }} />;
  }
  return <PanelLayout />;
}
