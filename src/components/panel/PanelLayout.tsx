import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { ExternalLink, LogOut, Moon, Plus, Sun } from "lucide-react";
import { api } from "../../lib/api";
import { useTheme } from "../../context/ThemeContext";

const iconButton =
  "flex h-10 w-10 items-center justify-center rounded-xl border border-theme text-muted transition-colors hover:bg-card hover:text-theme";

export function PanelLayout() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  async function logout() {
    try {
      await api.logout();
    } finally {
      navigate("/panel/login", { replace: true });
    }
  }

  return (
    <div className="min-h-screen bg-theme text-theme">
      <meta name="robots" content="noindex, nofollow" />
      <header className="border-b-2 border-theme">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-6">
            <Link to="/panel" className="font-striper text-xl font-black tracking-tighter transition-colors hover:text-accent">
              SOBAHUSN
            </Link>
            <nav className="flex items-center gap-1 text-sm font-medium" aria-label="Panel">
              <NavLink
                to="/panel"
                end
                className={({ isActive }) => `rounded-lg px-3 py-1.5 transition-colors ${isActive ? "text-accent" : "text-muted hover:text-theme"}`}
              >
                Articles
              </NavLink>
              <NavLink
                to="/panel/new"
                className={({ isActive }) => `flex items-center gap-1 rounded-lg px-3 py-1.5 transition-colors ${isActive ? "text-accent" : "text-muted hover:text-theme"}`}
              >
                <Plus size={14} />
                New
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/articles" target="_blank" className={iconButton} aria-label="View site (opens in a new tab)" title="View site">
              <ExternalLink size={16} />
            </Link>
            <button type="button" onClick={toggleTheme} className={iconButton} aria-label="Toggle theme" title="Toggle theme">
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button type="button" onClick={logout} className={iconButton} aria-label="Log out" title="Log out">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
