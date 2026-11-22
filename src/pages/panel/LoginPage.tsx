import { useEffect, useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { api, errorMessage } from "../../lib/api";
import { Button } from "../../components/ui/Button";
import { inputClass, labelClass } from "../../components/panel/ui";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/panel";
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Already signed in? Skip the form.
  useEffect(() => {
    const controller = new AbortController();
    api
      .me(controller.signal)
      .then((r) => r.authenticated && navigate(from, { replace: true }))
      .catch(() => {});
    return () => controller.abort();
  }, [from, navigate]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await api.login(password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-theme px-6 text-theme">
      <meta name="robots" content="noindex, nofollow" />
      <title>Log in | Panel</title>
      <form onSubmit={submit} className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-theme">
            <Lock size={18} />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight">Panel</h1>
            <p className="text-sm text-muted">Log in to manage your articles</p>
          </div>
        </div>

        <label htmlFor="password" className={labelClass}>
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          autoFocus
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "login-error" : undefined}
        />

        {error && (
          <p id="login-error" role="alert" className="mt-3 text-sm text-red-500">
            {error}
          </p>
        )}

        <Button type="submit" fullWidth isLoading={busy} disabled={busy || !password} className="mt-6">
          Log in
        </Button>
      </form>
    </main>
  );
}
