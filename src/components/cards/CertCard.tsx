import { motion } from "motion/react";
import { Award, FileCheck2, ExternalLink } from "lucide-react";
import type { Certification } from "../../types/types";

export function CertCard({
  cert,
  index,
}: {
  cert: Certification;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index * 0.08, 0.35), duration: 0.5 }}
      className="group p-6 rounded-2xl border border-theme bg-card hover:border-accent-amber/40 hover:shadow-theme transition-all duration-300"
    >
      {/* Icon + date row */}
      <div className="flex items-start justify-between mb-5">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{
            backgroundColor: "rgba(245,158,11,0.12)",
            color: "#f59e0b",
          }}
        >
          <FileCheck2 size={22} />
        </div>
        <span className="text-xs font-mono text-muted border border-theme px-2.5 py-1 rounded-lg">
          {cert.issueDate}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-bold text-theme text-base mb-2 leading-snug group-hover:text-accent transition-colors">
        {cert.title}
      </h3>

      {/* Issuer */}
      <p className="text-sm text-muted mb-5 flex items-center gap-1.5">
        <Award size={13} className="shrink-0 text-accent-amber" />
        {cert.issuer}
      </p>

      {/* Link */}
      {cert.link && (
        <a
          href={cert.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
          style={{ color: "var(--accent-amber)" }}
        >
          <ExternalLink size={12} />
          Verify Certificate
        </a>
      )}
    </motion.div>
  );
}
