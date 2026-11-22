import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { ProjectsPage, ProjectDetailPage } from "./pages/ProjectsPage";
import { CertificationsPage } from "./pages/CertificationsPage";
import { ArticlesPage } from "./pages/ArticlesPage";
import { ScrollOnTop } from "./components/ScrollOnTop";

// The article reader pulls in the markdown + syntax-highlighting code, so it loads on demand.
const ArticleDetailPage = lazy(() =>
  import("./pages/ArticleDetailPage").then((m) => ({
    default: m.ArticleDetailPage,
  })),
);

// The admin panel (editor, toolbar, uploader) is code-split so visitors never download it.
const RequireAuth = lazy(() =>
  import("./components/panel/RequireAuth").then((m) => ({
    default: m.RequireAuth,
  })),
);
const LoginPage = lazy(() =>
  import("./pages/panel/LoginPage").then((m) => ({ default: m.LoginPage })),
);
const DashboardPage = lazy(() =>
  import("./pages/panel/DashboardPage").then((m) => ({
    default: m.DashboardPage,
  })),
);
const EditorPage = lazy(() =>
  import("./pages/panel/EditorPage").then((m) => ({ default: m.EditorPage })),
);

function SiteRoutes() {
  return (
    <Layout>
      <ScrollOnTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/certificate" element={<CertificationsPage />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/articles/:slug" element={<ArticleDetailPage />} />

        {/* Redirect old paths for backwards compat */}
        <Route path="/profile" element={<Navigate to="/about" replace />} />
        <Route
          path="/certifications"
          element={<Navigate to="/certificate" replace />}
        />
        <Route path="/timeline" element={<Navigate to="/about" replace />} />
        <Route path="/contact" element={<Navigate to="/about" replace />} />

        {/* 404 catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Suspense fallback={<div className="min-h-screen bg-theme" />}>
        <Routes>
          {/* Admin panel: rendered without the public navbar/footer */}
          <Route path="/panel/login" element={<LoginPage />} />
          <Route path="/panel" element={<RequireAuth />}>
            <Route index element={<DashboardPage />} />
            <Route path="new" element={<EditorPage />} />
            <Route path="edit/:slug" element={<EditorPage />} />
          </Route>

          <Route path="*" element={<SiteRoutes />} />
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}
