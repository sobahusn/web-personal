export function SketchServer({ className }: { className?: string }) {
  return (
    <svg
      width="62"
      height="72"
      viewBox="0 0 62 72"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="5" y="5" width="52" height="62" rx="4" strokeWidth="1.4" />
      <rect x="10" y="12" width="42" height="11" rx="2" strokeWidth="1.1" />
      <rect x="10" y="28" width="42" height="11" rx="2" strokeWidth="1.1" />
      <rect x="10" y="44" width="42" height="11" rx="2" strokeWidth="1.1" />
      <circle cx="46" cy="17.5" r="2.5" strokeWidth="1" />
      <circle cx="46" cy="33.5" r="2.5" strokeWidth="1" />
      <circle cx="46" cy="49.5" r="2.5" strokeWidth="1" />
      <line x1="14" y1="17.5" x2="38" y2="17.5" strokeWidth="0.9" strokeOpacity="0.6" />
      <line x1="14" y1="33.5" x2="38" y2="33.5" strokeWidth="0.9" strokeOpacity="0.6" />
      <line x1="14" y1="49.5" x2="38" y2="49.5" strokeWidth="0.9" strokeOpacity="0.6" />
    </svg>
  );
}

export function SketchCodeTag({ className }: { className?: string }) {
  return (
    <svg
      width="68"
      height="52"
      viewBox="0 0 68 52"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="22,6 4,26 22,46" strokeWidth="2.2" />
      <polyline points="46,6 64,26 46,46" strokeWidth="2.2" />
      <line x1="38" y1="4" x2="30" y2="48" strokeWidth="1.6" strokeOpacity="0.7" />
    </svg>
  );
}

export function SketchShield({ className }: { className?: string }) {
  return (
    <svg
      width="58"
      height="66"
      viewBox="0 0 58 66"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path
        d="M29 4 L52 14 L52 30 C52 46 29 62 29 62 C29 62 6 46 6 30 L6 14 Z"
        strokeWidth="1.5"
      />
      <polyline points="19,31 26,38 40,22" strokeWidth="2" />
    </svg>
  );
}

export function SketchNetwork({ className }: { className?: string }) {
  return (
    <svg
      width="72"
      height="72"
      viewBox="0 0 72 72"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="36" cy="36" r="8" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="5" strokeWidth="1.2" />
      <circle cx="62" cy="10" r="5" strokeWidth="1.2" />
      <circle cx="10" cy="62" r="5" strokeWidth="1.2" />
      <circle cx="62" cy="62" r="5" strokeWidth="1.2" />
      <circle cx="36" cy="8" r="4" strokeWidth="1.2" />
      <line x1="14" y1="14" x2="28" y2="28" strokeWidth="1" strokeOpacity="0.7" />
      <line x1="58" y1="14" x2="44" y2="28" strokeWidth="1" strokeOpacity="0.7" />
      <line x1="14" y1="58" x2="28" y2="44" strokeWidth="1" strokeOpacity="0.7" />
      <line x1="58" y1="58" x2="44" y2="44" strokeWidth="1" strokeOpacity="0.7" />
      <line x1="36" y1="12" x2="36" y2="28" strokeWidth="1" strokeOpacity="0.7" />
    </svg>
  );
}

export function SketchGear({ className }: { className?: string }) {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="32" cy="32" r="11" strokeWidth="1.5" />
      <circle cx="32" cy="32" r="4.5" strokeWidth="1.2" />
      {/* Gear teeth */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45 * Math.PI) / 180;
        const x1 = 32 + 14 * Math.cos(angle);
        const y1 = 32 + 14 * Math.sin(angle);
        const x2 = 32 + 21 * Math.cos(angle);
        const y2 = 32 + 21 * Math.sin(angle);
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="4" />
        );
      })}
    </svg>
  );
}

export function SketchCloud({ className }: { className?: string }) {
  return (
    <svg
      width="76"
      height="52"
      viewBox="0 0 76 52"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path
        d="M18,38 C10,38 4,32 4,24 C4,16 10,10 18,10 C20,4 26,0 34,0 C44,0 52,7 52,16 C58,16 64,21 64,28 C64,34 58,38 52,38 Z"
        strokeWidth="1.4"
      />
      <line x1="26" y1="38" x2="26" y2="48" strokeWidth="1.1" strokeOpacity="0.7" />
      <line x1="38" y1="38" x2="38" y2="52" strokeWidth="1.1" strokeOpacity="0.7" />
      <line x1="50" y1="38" x2="50" y2="45" strokeWidth="1.1" strokeOpacity="0.7" />
    </svg>
  );
}

export function SketchBinary({ className }: { className?: string }) {
  return (
    <svg
      width="56"
      height="64"
      viewBox="0 0 56 64"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      className={className}
    >
      <text
        x="4"
        y="16"
        fontSize="14"
        fontFamily="monospace"
        strokeWidth="0.8"
        opacity="0.9"
      >
        10110
      </text>
      <text
        x="8"
        y="32"
        fontSize="14"
        fontFamily="monospace"
        strokeWidth="0.8"
        opacity="0.7"
      >
        01001
      </text>
      <text
        x="2"
        y="48"
        fontSize="14"
        fontFamily="monospace"
        strokeWidth="0.8"
        opacity="0.8"
      >
        11010
      </text>
    </svg>
  );
}

export function SketchElements() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* Server - top right */}
      <div
        className="absolute sketch-float-a"
        style={{ top: "8%", right: "4%", color: "var(--sketch-color)" }}
      >
        <SketchServer />
      </div>

      {/* Code tag - left center */}
      <div
        className="absolute sketch-float-b"
        style={{ top: "32%", left: "2%", color: "var(--sketch-color)" }}
      >
        <SketchCodeTag />
      </div>

      {/* Shield - top left */}
      <div
        className="absolute sketch-drift"
        style={{ top: "5%", left: "18%", color: "var(--sketch-color)" }}
      >
        <SketchShield />
      </div>

      {/* Network - bottom right */}
      <div
        className="absolute sketch-float-c"
        style={{ bottom: "12%", right: "8%", color: "var(--sketch-color)" }}
      >
        <SketchNetwork />
      </div>

      {/* Gear - bottom left */}
      <div
        className="absolute sketch-spin-slow"
        style={{
          bottom: "15%",
          left: "6%",
          color: "var(--sketch-color)",
          opacity: 0.55,
        }}
      >
        <SketchGear />
      </div>

      {/* Cloud - top center */}
      <div
        className="absolute sketch-float-b"
        style={{
          top: "14%",
          left: "45%",
          color: "var(--sketch-color)",
          opacity: 0.45,
        }}
      >
        <SketchCloud />
      </div>

      {/* Binary - mid right */}
      <div
        className="absolute sketch-float-c"
        style={{
          top: "55%",
          right: "2%",
          color: "var(--sketch-color)",
          opacity: 0.4,
        }}
      >
        <SketchBinary />
      </div>

      {/* Extra network node - bottom center */}
      <div
        className="absolute sketch-float-a"
        style={{
          bottom: "5%",
          left: "38%",
          color: "var(--sketch-color)",
          opacity: 0.35,
        }}
      >
        <SketchNetwork className="scale-75" />
      </div>
    </div>
  );
}
