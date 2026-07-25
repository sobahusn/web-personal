import { MapPin, Calendar, Briefcase, GraduationCap, Rocket } from "lucide-react";
import type { TimelineItem } from "../../types/types";

const typeConfig = {
  experience: {
    icon: Briefcase,
    label: "Experience",
    accentClass: "text-pink-500",
    bgClass: "bg-pink-500/15",
    borderClass: "border-pink-400",
    dotClass: "bg-pink-400",
  },
  education: {
    icon: GraduationCap,
    label: "Education",
    accentClass: "text-blue-500",
    bgClass: "bg-blue-500/15",
    borderClass: "border-blue-400",
    dotClass: "bg-blue-400",
  },
  bootcamp: {
    icon: Rocket,
    label: "Training",
    accentClass: "text-orange-500",
    bgClass: "bg-orange-500/15",
    borderClass: "border-orange-400",
    dotClass: "bg-orange-400",
  },
};

export function TimelineCard({ item }: { item: TimelineItem }) {
  const config = typeConfig[item.type];

  return (
    <div className="relative pl-10">
      {/* Dot */}
      <div
        className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${config.borderClass}`}
        style={{ backgroundColor: "var(--bg)" }}
      >
        <div className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
      </div>

      {/* Date */}
      <div className={`flex items-center gap-1.5 text-xs font-mono font-semibold mb-2 ${config.accentClass} uppercase tracking-wider`}>
        <Calendar size={11} />
        {item.date}
      </div>

      <h3 className="font-bold text-theme text-base mb-0.5">{item.title}</h3>
      <div className="flex flex-wrap gap-x-3 gap-y-0.5 mb-2">
        <span className="text-sm text-muted italic">{item.organization}</span>
        {item.location && (
          <span className="flex items-center gap-1 text-xs text-muted">
            <MapPin size={11} />
            {item.location}
          </span>
        )}
      </div>
      <p className="text-sm text-muted leading-relaxed">{item.description}</p>
    </div>
  );
}
