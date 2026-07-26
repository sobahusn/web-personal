import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { ProjectsPage, ProjectDetailPage } from "./pages/ProjectsPage";
import { CertificationsPage } from "./pages/CertificationsPage";
import { ArticlesPage } from "./pages/ArticlesPage";
import { ScrollOnTop } from "./components/ScrollOnTop";

function AppRoutes() {
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
      <AppRoutes />
    </ThemeProvider>
  );
}
