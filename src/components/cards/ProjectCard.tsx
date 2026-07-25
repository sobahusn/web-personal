import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { IconBrandGithub } from "@tabler/icons-react";
import type { Project } from "../../types/types";
import { categoryColor, getProjectIcon } from "../../utils/projectUtils";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const colors = categoryColor[project.category] || categoryColor["Archive"];
  const isArchive = project.category === "Archive";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index * 0.07, 0.3), duration: 0.5 }}
    >
      <Link
        to={`/projects/${project.id}`}
        className={`group block rounded-2xl border overflow-hidden hover:shadow-theme transition-all duration-300 ${
          isArchive ? "opacity-70 hover:opacity-100" : ""
        }`}
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--border)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = colors.border;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
        }}
      >
        {/* Image */}
        {project.image && (
          <div className={`relative overflow-hidden h-44 ${isArchive ? "grayscale group-hover:grayscale-0 transition-all" : ""}`}>
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            {project.featured && (
              <span
                className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                style={{ backgroundColor: "var(--accent)", color: "#fff" }}
              >
                Featured
              </span>
            )}
          </div>
        )}

        {/* Body */}
        <div className="p-5">
          {/* Category badge */}
          <span
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg mb-3"
            style={{ color: colors.text, backgroundColor: colors.bg }}
          >
            {getProjectIcon(project, 12)}
            {project.category}
          </span>

          <h3
            className="font-bold text-theme text-base mb-2 transition-colors"
            style={{}}
            onMouseEnter={() => {}}
          >
            {project.title}
          </h3>
          <p className="text-muted text-sm leading-relaxed mb-4 line-clamp-2">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-[11px] px-2.5 py-1 rounded-full font-mono"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--accent) 8%, var(--bg))",
                  color: "var(--text-muted)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex gap-3 pt-3 border-t border-theme">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 text-xs text-muted hover:text-theme transition-colors font-medium"
              >
                <IconBrandGithub size={14} />
                Source
              </a>
            )}
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 text-xs font-medium transition-colors"
                style={{ color: "var(--accent)" }}
              >
                <ExternalLink size={14} />
                Live Demo
              </a>
            )}
            <span
              className="ml-auto text-xs font-medium flex items-center gap-1 transition-all opacity-0 group-hover:opacity-100"
              style={{ color: "var(--accent)" }}
            >
              View Details <ArrowLeft size={12} className="rotate-180" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
