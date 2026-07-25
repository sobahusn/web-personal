import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useParams, useNavigate } from "react-router-dom";
import { ExternalLink, ArrowLeft, Tag, Search, X } from "lucide-react";
import { IconBrandGithub } from "@tabler/icons-react";
import { PROJECTS } from "../constants/constants";
import { CATEGORIES, categoryColor } from "../utils/projectUtils";
import { ProjectCard } from "../components/cards/ProjectCard";

function ProjectDetail({ id }: { id: string }) {
  const navigate = useNavigate();
  const project = PROJECTS.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="text-center py-24">
        <p className="text-muted mb-4">Project not found.</p>
        <button
          onClick={() => navigate("/projects")}
          className="text-accent text-sm font-medium"
        >
          ← Back to Projects
        </button>
      </div>
    );
  }

  const colors =
    (project.category && categoryColor[project.category]) ||
    categoryColor["Archive"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <button
        onClick={() => navigate("/projects")}
        className="flex items-center gap-2 text-muted hover:text-theme text-sm font-medium mb-10 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Projects
      </button>

      {/* Hero image */}
      {project.image && (
        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-10 shadow-theme-lg">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-linear-to-l from-black/70 via-transparent to-transparent" />
        </div>
      )}

      {/* Header */}
      <div className="mb-10">
        <span
          className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg mb-4"
          style={{ color: colors.text, backgroundColor: colors.bg }}
        >
          <Tag size={11} />
          {project.category}
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-theme mb-6 leading-tight">
          {project.title}
        </h1>
        <div className="flex flex-wrap gap-3">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-card border border-theme text-sm font-medium text-theme hover:border-accent/40 transition-all"
            >
              <IconBrandGithub size={18} />
              Source Code
            </a>
          )}
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all active:scale-[0.97]"
              style={{ backgroundColor: "var(--accent)" }}
            >
              <ExternalLink size={16} />
              Live Demo
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8">
        <div className="p-6 md:p-8 bg-card rounded-2xl border border-theme">
          <h2 className="font-bold text-theme text-lg mb-4">
            Project Overview
          </h2>
          <p className="text-muted leading-relaxed text-base">
            {project.longDescription || project.description}
          </p>
        </div>

        <div className="p-6 md:p-8 bg-card rounded-2xl border border-theme">
          <h2 className="font-bold text-theme text-lg mb-4">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 rounded-xl text-sm font-mono border"
                style={{
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: colors.bg,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProjectsList() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = PROJECTS.filter((p) => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="section-divider" />
          <h1 className="text-4xl md:text-5xl font-bold text-theme mb-3">
            Projects
          </h1>
          <p className="text-muted text-lg">
            {PROJECTS.length} projects across AI, Web, Backend & more
          </p>
        </motion.div>

        {/* Filters row */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "text-white"
                    : "border border-theme text-muted hover:text-theme hover:border-accent/30"
                }`}
                style={
                  activeCategory === cat
                    ? { backgroundColor: "var(--accent)" }
                    : {}
                }
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="sm:ml-auto flex items-center gap-2 px-4 py-2 rounded-full border border-theme bg-card text-sm min-w-48">
            <Search size={14} className="text-muted shrink-0" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none flex-1 text-theme placeholder:text-muted text-sm"
            />
            <AnimatePresence>
              {search && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  onClick={() => setSearch("")}
                  className="text-muted hover:text-theme"
                >
                  <X size={14} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Results count */}
        <p className="text-muted text-sm mb-6 font-mono">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
          {search ? ` for "${search}"` : ""}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-muted text-lg">No projects found.</p>
            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
              className="mt-4 text-accent text-sm font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function ProjectsPage() {
  const { id } = useParams<{ id?: string }>();
  return id ? <ProjectDetail id={id} /> : <ProjectsList />;
}

// Named export for detail used in App routing
export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        {id ? <ProjectDetail id={id} /> : null}
      </div>
    </div>
  );
}
