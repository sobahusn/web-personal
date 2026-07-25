import { BrainCircuit, Database, FileCode, FileText } from "lucide-react";
import type { Project } from "../types/types";

export const CATEGORIES = ["All", "AI Engineer", "FrontEnd", "BackEnd", "Archive"];

export const categoryColor: Record<string, { text: string; bg: string; border: string }> = {
  "AI Engineer": {
    text: "#e879f9",
    bg: "rgba(232,121,249,0.1)",
    border: "rgba(232,121,249,0.25)",
  },
  FrontEnd: {
    text: "#60a5fa",
    bg: "rgba(96,165,250,0.1)",
    border: "rgba(96,165,250,0.25)",
  },
  BackEnd: {
    text: "#34d399",
    bg: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.25)",
  },
  Archive: {
    text: "#9ca3af",
    bg: "rgba(156,163,175,0.1)",
    border: "rgba(156,163,175,0.25)",
  },
};

export const categoryColorSimple: Record<string, string> = {
  "AI Engineer": "#e879f9",
  FrontEnd: "#60a5fa",
  BackEnd: "#34d399",
  Archive: "#9ca3af",
};

export function getProjectIcon(project: Project, size = 18) {
  const tags = project.tags.join(" ").toLowerCase();
  if (tags.includes("python") || tags.includes("ai") || tags.includes("llm"))
    return <BrainCircuit size={size} color="#e879f9" />;
  if (tags.includes("react") || tags.includes("typescript") || tags.includes("next"))
    return <FileCode size={size} color="#60a5fa" />;
  if (tags.includes("go") || tags.includes("postgres") || tags.includes("redis"))
    return <Database size={size} color="#34d399" />;
  return <FileText size={size} color="#9ca3af" />;
}
