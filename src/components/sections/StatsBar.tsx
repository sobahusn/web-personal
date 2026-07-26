import { motion } from "motion/react";
import { PROJECTS, CERTIFICATIONS } from "../../constants/constants";

export function StatsBar() {
  const stats = [
    { value: "3+", label: "Years Experience" },
    { value: `${PROJECTS.length}+`, label: "Projects Built" },
    { value: `${CERTIFICATIONS.length}`, label: "Credentials" },
    { value: "∞", label: "Lines of Code" },
  ];

  return (
    <div className="border-y-2 border-theme bg-bg w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y-2 sm:divide-y-0 sm:divide-x-2 divide-theme">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="relative flex flex-col justify-between p-10 lg:p-12 min-h-64 lg:min-h-full group hover:bg-card transition-colors duration-300 overflow-hidden"
          >
            {/* Animated Background Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-accent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />

            {/* Massive Content */}
            <div className="mt-8 ">
              <div className="font-striper text-6xl md:text-7xl lg:text-8xl font-black text-theme leading-none tracking-tighter mb-4 group-hover:scale-105 origin-left transition-transform duration-500">
                {s.value}
              </div>
              <div className="text-sm md:text-base font-bold uppercase tracking-widest text-muted group-hover:text-accent transition-colors duration-300">
                {s.label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
