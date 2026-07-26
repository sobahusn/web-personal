import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { IconBrandLinkedinFilled, IconBrandGithub } from "@tabler/icons-react";
import { TIMELINE } from "../constants/constants";
import type { TimelineItem } from "../types/types";
import { ContactCTA } from "../components/sections/ContactCTA";

export function AboutPage() {
  const sortByYear = (a: TimelineItem, b: TimelineItem) => {
    const yearA = parseInt(a.date.split(" - ")[0]) || 0;
    const yearB = parseInt(b.date.split(" - ")[0]) || 0;
    return yearB - yearA;
  };

  const experience = TIMELINE.filter((t) => t.type === "experience").sort(
    sortByYear,
  );
  const education = TIMELINE.filter((t) => t.type === "education").sort(
    sortByYear,
  );
  const bootcamps = TIMELINE.filter((t) => t.type === "bootcamp").sort(
    sortByYear,
  );

  const technologies = [
    "Linux",
    "Docker",
    "Node.js",
    "JavaScript",
    "React",
    "TypeScript",
    "Next.js",
    "Python",
    "FastAPI",
    "Go",
  ];

  const renderLedger = (title: string, items: TimelineItem[]) => (
    <div className="mb-24">
      <div className="flex items-center gap-6 mb-8">
        <h3 className="text-3xl md:text-4xl font-black text-theme uppercase tracking-widest">
          {title}
        </h3>
        <div className="h-1 flex-1 bg-theme opacity-30" />
      </div>
      <div className="flex flex-col border-t-2 border-theme">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (i % 5) * 0.1 }}
            className="group flex flex-col md:flex-row md:items-center gap-4 md:gap-12 py-8 border-b border-theme hover:bg-card transition-colors duration-300 px-4 md:px-8 -mx-4 md:-mx-8 cursor-default"
          >
            {/* Date */}
            <div className="w-full md:w-48 shrink-0 text-sm md:text-lg font-bold font-mono text-muted group-hover:text-theme transition-colors">
              {item.date}
            </div>

            {/* Title & Organization */}
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-black text-theme group-hover:text-accent transition-colors duration-300 mb-1">
                {item.title}
              </h3>
              <div className="text-sm font-bold text-muted uppercase tracking-wider">
                {item.organization} {item.location && `| ${item.location}`}
              </div>
            </div>

            {/* Description Reveal on Hover (Desktop) */}
            <div className="w-full md:w-96 text-sm text-muted/80 leading-relaxed md:opacity-0 md:-translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
              {item.description}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="pt-24 md:pt-32 bg-theme overflow-hidden">
      {/* ── PROFILE HERO: Brutalist Split ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-32">
        <div className="flex flex-col lg:flex-row items-end gap-12 lg:gap-20">
          {/* Avatar side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-5/12 shrink-0 relative group"
          >
            <div className="absolute top-4 -left-4 w-full h-full bg-accent/20 border-2 border-accent/50 -z-10 transition-transform duration-500 group-hover:translate-x-2 group-hover:-translate-y-2" />
            <img
              src="https://github.com/sobahusn.png"
              alt="Ni'am Portrait"
              className="w-full aspect-square object-cover grayscale-60 group-hover:grayscale-0 transition-all duration-700 shadow-theme-lg"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-bg/80 backdrop-blur-md border border-black/20 p-4 flex items-center justify-between ">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-theme">
                Status
              </span>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="font-outift text-xs font-bold uppercase tracking-[0.2em] text-green-500">
                  Open to work
                </span>
              </div>
            </div>
          </motion.div>

          {/* Text side */}
          <div className="w-full lg:w-7/12 flex flex-col justify-end">
            <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black text-theme leading-[0.8] tracking-tighter mb-8 uppercase">
              ABOUT <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-accent to-accent-amber">
                NI'AM.
              </span>
            </h1>

            <div className="w-16 h-1.5 bg-accent mb-8" />

            <div className="text-xl md:text-2xl lg:text-3xl font-bold text-muted leading-tight mb-10">
              Informatics Engineering Student at{" "}
              <span className="text-theme">
                Universitas Muhammadiyah Sidoarjo
              </span>
              , with a background in{" "}
              <span className="text-theme">
                Computer and Network Engineering
              </span>
              .
            </div>

            <p className="text-base md:text-lg text-muted/80 leading-relaxed mb-10 max-w-2xl">
              Currently, I am focused on developing my interest in Web
              Development, especially Front-End Development. I continue to
              develop my skills and intentions in the field. I am highly
              motivated to keep learning and developing in the ever-evolving
              world of technology.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://github.com/sobahusn"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-6 py-3 border border-theme bg-card hover:bg-theme hover:text-accent font-bold uppercase tracking-widest text-xs transition-all"
              >
                <IconBrandGithub
                  size={18}
                  className="group-hover:-rotate-12 transition-transform"
                />
                GitHub <ArrowUpRight size={14} className="opacity-50" />
              </a>
              <a
                href="https://linkedin.com/in/sobahus-niam"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-6 py-3 border border-theme bg-card hover:bg-theme hover:text-accent font-bold uppercase tracking-widest text-xs transition-all"
              >
                <IconBrandLinkedinFilled
                  size={18}
                  className="group-hover:-rotate-12 transition-transform"
                />
                LinkedIn <ArrowUpRight size={14} className="opacity-50" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS MARQUEE ── */}
      <div className="border-y border-theme bg-card py-6 overflow-hidden relative z-10 mb-32">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 15 }}
          className="flex whitespace-nowrap w-max"
        >
          {technologies.map((tech, i) => (
            <div
              key={i}
              className="text-theme text-2xl md:text-4xl font-black uppercase tracking-widest mx-8 md:mx-12"
            >
              {tech}
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── TIMELINE LEDGER ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-32">
        <h2 className="font-outfit border-b border-theme text-5xl md:text-7xl font-black text-theme uppercase tracking-tighter leading-none mb-16">
          MY JOURNEY
        </h2>

        {renderLedger("Professional Experience", experience)}
        {renderLedger("Education", education)}
        {renderLedger("Training & Bootcamps", bootcamps)}
      </section>

      {/* ── Contact CTA ── */}
      <ContactCTA
        title="READY TO START?"
        description="Whether it's a freelance gig, a full-time role, or just a coffee chat. I'm always open to discussing new ideas."
        showGithub={false}
      />
    </div>
  );
}
