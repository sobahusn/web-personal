import { motion } from "motion/react";
import { Code2, Palette, Database, Cloud } from "lucide-react";

const SKILLS = [
  {
    title: "AI & Machine Learning",
    icon: Database,
    items: ["Machine Learning", "Deep Learning", "MLOps", "Python", "TensorFlow"],
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    title: "Frontend & Web",
    icon: Palette,
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    color: "text-sky-500",
    bg: "bg-sky-500/10",
  },
  {
    title: "Backend & System",
    icon: Code2,
    items: ["Node.js", "FastAPI", "Go", "PostgreSQL", "REST-API"],
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "DevOps & Networking",
    icon: Cloud,
    items: ["Docker", "Networking", "Fiber Optic", "CI/CD", "Server Maintenance"],
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

export function SkillsSection() {
  return (
    <section className="border-y border-theme bg-card">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20">
        <div className="mb-10">
          <div className="section-divider" />
          <h2 className="text-2xl md:text-3xl font-bold text-theme">
            Technical Arsenal
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SKILLS.map((skill, i) => (
            <motion.div
              key={skill.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-5 bg-theme rounded-2xl border border-theme hover:border-accent/30 transition-all group"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${skill.bg} ${skill.color} group-hover:scale-110 transition-transform`}
              >
                <skill.icon size={20} />
              </div>
              <h3 className="font-bold text-theme mb-3">{skill.title}</h3>
              <div className="flex flex-wrap gap-1.5">
                {skill.items.map((item) => (
                  <span
                    key={item}
                    className="text-[11px] px-2 py-1 rounded-lg bg-card text-muted font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
