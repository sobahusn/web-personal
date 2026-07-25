import { useEffect, useState } from "react";
import { motion } from "motion/react";

type Token = { text: string; color: string; glow?: boolean };
type CodeLine = { tokens: Token[]; lineNum: number };

const TERMINAL_LINES: CodeLine[] = [
  {
    lineNum: 1,
    tokens: [
      { text: "export const ", color: "#f59e0b" },
      { text: "aboutMe", color: "#f2efe9" },
      { text: " = {", color: "#f2efe9" },
    ],
  },
  {
    lineNum: 2,
    tokens: [
      { text: "  name", color: "#f2efe9" },
      { text: ": ", color: "#aeaeb2" },
      { text: '"Ni\'am"', color: "#e8622a", glow: true },
      { text: ",", color: "#aeaeb2" },
    ],
  },
  {
    lineNum: 3,
    tokens: [
      { text: "  title", color: "#f2efe9" },
      { text: ": ", color: "#aeaeb2" },
      { text: '"Software Engineer"', color: "#e8622a", glow: true },
      { text: ",", color: "#aeaeb2" },
    ],
  },
  {
    lineNum: 4,
    tokens: [
      { text: "  stack", color: "#f2efe9" },
      { text: ": [", color: "#aeaeb2" },
      { text: '"React"', color: "#e8622a" },
      { text: ", ", color: "#aeaeb2" },
      { text: '"FastAPI"', color: "#e8622a" },
      { text: ", ", color: "#aeaeb2" },
      { text: '"Python"', color: "#e8622a" },
      { text: "],", color: "#aeaeb2" },
    ],
  },
  {
    lineNum: 5,
    tokens: [
      { text: "  focus", color: "#f2efe9" },
      { text: ": [", color: "#aeaeb2" },
      { text: '"Web"', color: "#e8622a" },
      { text: ", ", color: "#aeaeb2" },
      { text: '"AI"', color: "#e8622a" },
      { text: ", ", color: "#aeaeb2" },
      { text: '"Cloud"', color: "#e8622a" },
      { text: "],", color: "#aeaeb2" },
    ],
  },
  {
    lineNum: 6,
    tokens: [
      { text: "  location", color: "#f2efe9" },
      { text: ": ", color: "#aeaeb2" },
      { text: '"Sidoarjo"', color: "#e8622a" },
      { text: ",", color: "#aeaeb2" },
    ],
  },
  {
    lineNum: 7,
    tokens: [
      { text: "  available", color: "#f2efe9" },
      { text: ": ", color: "#aeaeb2" },
      { text: "true", color: "#10b981", glow: true },
      { text: ",", color: "#aeaeb2" },
    ],
  },
  {
    lineNum: 8,
    tokens: [{ text: "};", color: "#f2efe9" }],
  },
  {
    lineNum: 9,
    tokens: [{ text: "", color: "" }],
  },
  {
    lineNum: 10,
    tokens: [{ text: "// Initializing system protocols...", color: "#6b7280" }],
  },
  {
    lineNum: 11,
    tokens: [
      { text: "const ", color: "#f59e0b" },
      { text: "mission ", color: "#f2efe9" },
      { text: "= () ", color: "#aeaeb2" },
      { text: "=> ", color: "#f59e0b" },
      { text: "buildFuture", color: "#60a5fa", glow: true },
      { text: "();", color: "#aeaeb2" },
    ],
  },
];

export function TerminalWindow() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const promptTimer = setTimeout(() => setShowPrompt(true), 300);

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleLines(i);
      if (i >= TERMINAL_LINES.length) clearInterval(interval);
    }, 150);

    return () => {
      clearTimeout(promptTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-xl lg:max-w-2xl mx-auto lg:mx-0 group"
    >
      {/* Dynamic Glow */}
      <div className="absolute -inset-1 rounded-3xl bg-linear-to-r from-accent/30 via-accent-amber/20 to-accent/30 blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />

      <div className="relative rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        {/* macOS-style title bar */}
        <div className="flex items-center px-4 py-3 bg-white/5 border-b border-white/10">
          <div className="flex gap-2 shrink-0">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] border border-black/20" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-black/20" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f] border border-black/20" />
          </div>

          <div className="flex-1 text-center">
            <span className="text-[11px] font-mono text-white/40 tracking-tight">
              ~/about.ts — fish
            </span>
          </div>

          <div className="w-12 shrink-0" />
        </div>

        {/* Code area */}
        <div
          className="relative p-5 md:p-6 font-mono text-[11px] md:text-sm leading-relaxed min-h-80 overflow-x-auto"
          style={{
            fontFamily: "'SF Mono', Menlo, Monaco, Consolas, monospace",
          }}
        >
          {/* Subtle scanline texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, #fff 0px, transparent 1px, transparent 2px, #fff 3px)",
            }}
          />

          {showPrompt && (
            <div className="flex gap-4 mb-3 opacity-70 whitespace-nowrap">
              <span className="shrink-0 w-6" />
              <span className="text-[#27c93f]">➜</span>
              <span className="text-white/60 ml-1">node about.ts</span>
            </div>
          )}

          {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
            <div key={i} className="flex gap-4 line-appear whitespace-nowrap">
              <span className="shrink-0 w-6 text-right select-none text-white/20 text-[10px] md:text-xs">
                {line.lineNum < 10 ? `0${line.lineNum}` : line.lineNum}
              </span>
              <span className="inline-flex">
                {line.tokens.map((token, j) => (
                  <span
                    key={j}
                    style={{
                      color: token.color,
                      whiteSpace: "pre",
                      textShadow: token.glow
                        ? `0 0 10px ${token.color}80`
                        : "none",
                    }}
                  >
                    {token.text}
                  </span>
                ))}

                {i === visibleLines - 1 &&
                  visibleLines < TERMINAL_LINES.length && (
                    <span className="inline-block w-1.5 h-4 ml-0.5 cursor-blink bg-accent align-middle shadow-[0_0_8px_var(--accent)]" />
                  )}
              </span>
            </div>
          ))}

          {visibleLines >= TERMINAL_LINES.length && (
            <div className="flex gap-4 mt-3">
              <span className="shrink-0 w-6" />
              <div className="flex items-center gap-2">
                <span className="text-[#27c93f]">➜</span>
                <span className="inline-block w-2 h-4 cursor-blink bg-accent shadow-[0_0_8px_var(--accent)]" />
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
