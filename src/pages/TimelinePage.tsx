import { motion } from "motion/react";
import {
  GraduationCap,
  Briefcase,
  Calendar,
  MapPin,
  Rocket,
} from "lucide-react";
import { TIMELINE } from "../constants/constants";

export function TimelinePage() {
  const experienceItems = TIMELINE.filter((item) => item.type === "experience");
  const educationItems = TIMELINE.filter((item) => item.type === "education");
  const bootcampItems = TIMELINE.filter((item) => item.type === "bootcamp");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl py-6 px-4 md:px-0"
    >
      <div className="space-y-16">
        <section>
          <div className="flex items-center gap-3 mb-10">
            <div className="p-3 bg-pink-500/20 text-pink-400 rounded-lg">
              <Briefcase size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-vsc-text">
                Professional Experience
              </h2>
              <p className="text-vsc-text/40 text-xs uppercase tracking-widest font-medium">
                Work History & Freelance
              </p>
            </div>
          </div>
          <div className="relative ml-4 pl-8 border-l border-vsc-border space-y-12">
            {experienceItems.map((item) => (
              <TimelineCard key={item.id} item={item} color="pink" />
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <section>
            <div className="flex items-center gap-3 mb-10">
              <div className="p-3 bg-blue-500/20 text-blue-400 rounded-lg">
                <GraduationCap size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-vsc-text">Education</h2>
                <p className="text-vsc-text/40 text-xs uppercase tracking-widest font-medium">
                  Academic Background
                </p>
              </div>
            </div>
            <div className="relative ml-4 pl-8 border-l border-vsc-border space-y-12">
              {educationItems.map((item) => (
                <TimelineCard key={item.id} item={item} color="blue" />
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-10">
              <div className="p-3 bg-orange-500/20 text-orange-400 rounded-lg">
                <Rocket size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-vsc-text">
                  Intensive Training
                </h2>
                <p className="text-vsc-text/40 text-xs uppercase tracking-widest font-medium">
                  Bootcamps & Specializations
                </p>
              </div>
            </div>
            <div className="relative ml-4 pl-8 border-l border-vsc-border space-y-12">
              {bootcampItems.map((item) => (
                <TimelineCard key={item.id} item={item} color="orange" />
              ))}
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
}

function TimelineCard({
  item,
  color,
}: {
  item: any;
  color: "pink" | "blue" | "orange";
}) {
  const colorMap = {
    pink: "border-pink-400 text-pink-400",
    blue: "border-blue-400 text-blue-400",
    orange: "border-orange-400 text-orange-400",
  };
  const bgActiveMap = {
    pink: "bg-pink-400",
    blue: "bg-blue-400",
    orange: "bg-orange-400",
  };

  return (
    <div className="relative">
      <div
        className={`absolute -left-10.25 top-0 w-5 h-5 bg-vsc-bg border-2 ${colorMap[color].split(" ")[0]} rounded-full flex items-center justify-center`}
      >
        <div className={`w-2 h-2 ${bgActiveMap[color]} rounded-full`} />
      </div>
      <div
        className={`${colorMap[color].split(" ")[1]} text-xs font-mono font-bold mb-1 flex items-center gap-2 uppercase tracking-tighter`}
      >
        <Calendar size={12} /> {item.date}
      </div>
      <h3 className="text-lg font-bold text-vsc-text mb-1">{item.title}</h3>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3">
        <div className="text-vsc-text/60 italic text-sm">
          {item.organization}
        </div>
        {item.location && (
          <div className="flex items-center gap-1.5 text-vsc-text/40 text-xs">
            <MapPin size={12} />
            {item.location}
          </div>
        )}
      </div>
      <p className="text-vsc-text/70 text-sm leading-relaxed max-w-xl">
        {item.description}
      </p>
    </div>
  );
}
