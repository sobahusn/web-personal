export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  tags: string[];
  special?: string;
  link?: string;
  github?: string;
  image?: string;
  featured?: boolean;
  category?: string;
  date?: string;
}

export interface TimelineItem {
  id: string;
  type: "experience" | "education" | "bootcamp";
  title: string;
  organization: string;
  location?: string;
  date: string;
  description: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  link?: string;
  description?: string;
  verificationUrl?: string;
  skills?: string[];
  featured?: boolean;
}

export type ViewType =
  | "home"
  | "profile"
  | "contact"
  | "projects"
  | "timeline"
  | "articles"
  | "certifications";

export type ViewMode = "icons" | "detail" | "compact";
