import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { IconBrandGithub } from "@tabler/icons-react";
import { Button } from "../ui/Button";

interface ContactCTAProps {
  title?: string;
  description?: string;
  showGithub?: boolean;
}

export function ContactCTA({
  title = "LET'S BUILD SOMETHING",
  description = "Open to freelance projects, collaborations, and full-time opportunities. Let's create something amazing.",
  showGithub = true,
}: ContactCTAProps) {
  return (
    <section className="pt-20 pb-32 bg-theme overflow-hidden border-t border-theme border-dashed relative">
      {/* Background Abstract */}
      <div className="absolute -top-40 -right-40 w-160 h-160 rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

      {/* Massive Interactive Marquee Title */}
      <div className="relative group cursor-pointer border-b border-theme pb-8 md:pb-12 mb-16 overflow-hidden">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 15 }}
          className="flex whitespace-nowrap items-center text-theme group-hover:text-accent transition-colors duration-500 w-max"
        >
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center">
              <span className="text-[5rem] sm:text-[7rem] md:text-[10rem] font-black leading-none tracking-tighter mx-4 md:mx-8">
                {title}
              </span>
              <ArrowUpRight className="w-16 h-16 md:w-32 md:h-32 mx-4 md:mx-8 stroke-3" />
            </div>
          ))}
        </motion.div>

        {/* Overlay Hover Pill */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-bg/30 backdrop-blur-sm">
          <div className="bg-theme text-theme px-8 py-4 rounded-full text-lg md:text-2xl font-black uppercase tracking-widest flex items-center gap-4 shadow-theme-lg transform scale-90 group-hover:scale-100 transition-transform duration-500 ease-[0.16,1,0.3,1]">
            Click to talk <ArrowUpRight size={24} className="text-accent" />
          </div>
        </div>

        {/* Hitbox covering the marquee */}
        <Link
          to="/about"
          className="absolute inset-0 z-10"
          aria-label="Get in Touch"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-12">
          {/* Brutalist Description */}
          <div className="max-w-2xl">
            <div className="w-16 h-1.5 bg-accent mb-8" />
            <p className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-muted">
              {description.split(" ").map((word, i) => (
                <span
                  key={i}
                  className="hover:text-theme transition-colors duration-300 cursor-default"
                >
                  {word}{" "}
                </span>
              ))}
            </p>
          </div>

          {/* Action Links */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto shrink-0">
            <Button
              to="/about"
              variant="primary"
              size="lg"
              rightIcon={<ArrowUpRight size={20} />}
              className="py-6 px-10 text-base md:text-lg"
            >
              Start a Project
            </Button>
            {showGithub && (
              <Button
                href="https://github.com/sobahusn"
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                size="lg"
                leftIcon={<IconBrandGithub size={22} />}
                className="py-6 px-10 text-base md:text-lg"
              >
                View GitHub
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
