import { useState } from "react";
import { motion } from "motion/react";
import { ArrowDownRight } from "lucide-react";
import { TerminalWindow } from "./TerminalWindow";
import { Button } from "../ui/Button";

export function HeroSection() {
  const name = "NI'AM".split("");
  const [activeWindow, setActiveWindow] = useState<"subtitle" | "terminal">(
    "terminal",
  );

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-theme pt-16">
      {/* Massive Background Typography */}
      <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none opacity-[0.03] dark:opacity-[0.07] z-0 overflow-hidden">
        <h1 className="text-[25vw] font-black leading-[0.8] tracking-tighter text-theme whitespace-nowrap">
          SOFTWARE
        </h1>
        <h1
          className="text-[25vw] font-black leading-[0.8] tracking-tighter text-transparent whitespace-nowrap"
          style={{ WebkitTextStroke: "2px var(--text)" }}
        >
          ENGINEER
        </h1>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center pb-32">
        {/* Kinetic Name Reveal */}
        <div className="flex overflow-hidden mt-8 mb-10 z-10 relative pointer-events-none">
          {name.map((letter, i) => (
            <motion.span
              key={i}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{
                duration: 0.8,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-7xl sm:text-8xl md:text-[10rem] lg:text-[12rem] font-black text-theme leading-none tracking-tighter"
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Floating Subtitle Container */}
        <motion.div
          onPointerDown={() => setActiveWindow("subtitle")}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: 1,
            scale: 1,
            zIndex: activeWindow === "subtitle" ? 40 : 20,
          }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-card/80 backdrop-blur-md border border-theme p-8 md:p-10 rounded-3xl max-w-2xl text-center shadow-theme-lg relative cursor-default"
        >
          <p className="text-lg md:text-xl text-muted font-medium leading-relaxed mb-8 pointer-events-none">
            <span className="text-accent font-semibold pointer-events-none">AI Engineer Enthusiast</span> | Undergraduate Informatics Student at Universitas Muhammadiyah Sidoarjo | <span className="text-theme">Network Engineer</span> | <span className="text-theme">Web Developer</span> | Mobile Developer Enthusiast | Cyber Security Enthusiast
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              to="/projects"
              variant="primary"
              size="lg"
              rightIcon={<ArrowDownRight size={18} />}
            >
              Explore Projects
            </Button>
            <Button to="/about" variant="outline" size="lg">
              Who's he?
            </Button>
          </div>
        </motion.div>

        {/* Terminal Draggable element */}
        <motion.div
          onPointerDown={() => setActiveWindow("terminal")}
          drag
          dragConstraints={{ left: -800, right: 200, top: -400, bottom: 200 }}
          dragElastic={0.1}
          dragMomentum={true}
          whileDrag={{ scale: 1.05, cursor: "grabbing", zIndex: 50 }}
          initial={{ opacity: 0, y: 50, rotate: 5 }}
          animate={{
            opacity: 1,
            y: 0,
            rotate: 3,
            zIndex: activeWindow === "terminal" ? 40 : 20,
          }}
          whileHover={{ rotate: 0, scale: 1.02 }}
          transition={{ duration: 0.8, delay: 0.9, type: "spring" }}
          className="absolute -bottom-10 right-4 md:right-10 lg:right-20 w-full max-w-md hidden lg:block cursor-grab"
        >
          <div className="origin-bottom-left pointer-events-none">
            <TerminalWindow />
          </div>
        </motion.div>

        {/* Abstract Geometry */}
        <motion.div
          initial={{ opacity: 0, x: -50, rotate: -10 }}
          animate={{ opacity: 1, x: 0, rotate: -6 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute top-1/2 left-10 md:left-20 w-48 h-64 border-2 border-accent/20 rounded-full hidden lg:block sketch-float-a pointer-events-none"
        />
      </div>

      {/* Infinite Marquee Footer of Hero */}
      <div className="absolute bottom-0 left-0 w-full border-t border-theme bg-card py-3 overflow-hidden z-20">
        <motion.div
          animate={{ x: [0, -1035] }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "linear",
          }}
          className="flex whitespace-nowrap"
        >
          {/* Repeating the text to create a seamless loop */}
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="text-xs uppercase tracking-[0.2em] font-semibold text-theme mx-4"
            >
              • SOFTWARE ENGINEERING • ARTIFICIAL INTELLIGENCE • CLOUD
              ARCHITECTURE • MODERN UI/UX
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
