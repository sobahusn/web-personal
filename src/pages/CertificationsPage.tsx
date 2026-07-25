import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Award, ArrowUpRight, X } from "lucide-react";
import { CERTIFICATIONS } from "../constants/constants";
import type { Certification } from "../types/types";

export function CertificationsPage() {
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (selectedCert) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedCert]);

  return (
    <div className="pt-24 md:pt-32 bg-theme overflow-hidden min-h-screen relative">
      
      {/* ── HERO ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-20 md:mb-32">
        <div className="flex flex-col md:flex-row items-end justify-between gap-12 border-b-2 border-theme pb-12">
          <div>
            <h1 className="text-5xl md:text-7xl lg:text-[8rem] font-black leading-[0.8] tracking-tighter text-theme uppercase mb-8">
              VERIFIED <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-amber">CREDENTIALS.</span>
            </h1>
            <p className="text-xl md:text-2xl font-bold text-muted max-w-xl">
              Professional certifications bridging the gap between theoretical knowledge and industry standards.
            </p>
          </div>
          
          <div className="shrink-0 flex flex-col items-end">
             <div className="text-[6rem] font-black text-theme leading-none">{CERTIFICATIONS.length}</div>
             <div className="text-sm font-bold uppercase tracking-widest text-accent">Total Certs</div>
          </div>
        </div>
      </section>

      {/* ── BRUTALIST LIST ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-32">
        <div className="flex flex-col border-t border-theme">
          {CERTIFICATIONS.map((cert, i) => (
            <motion.div 
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedCert(cert)}
              className="group flex flex-col md:flex-row md:items-center gap-6 md:gap-12 py-8 border-b border-theme hover:bg-card hover:px-8 -mx-8 px-8 transition-all duration-300 cursor-pointer"
            >
              {/* Year */}
              <div className="w-full md:w-32 shrink-0 text-xl md:text-3xl font-black text-muted group-hover:text-theme transition-colors">
                {cert.issueDate}
              </div>
              
              {/* Title & Issuer */}
              <div className="flex-1">
                <h3 className="text-2xl md:text-4xl font-black text-theme group-hover:text-accent transition-colors duration-300 mb-2 leading-none tracking-tighter">
                  {cert.title}
                </h3>
                <div className="text-sm md:text-base font-bold text-muted uppercase tracking-widest">
                  ISSUED BY // {cert.issuer}
                </div>
              </div>

              {/* Action */}
              <div className="w-16 h-16 shrink-0 rounded-full border border-theme flex items-center justify-center text-muted group-hover:bg-theme group-hover:text-accent transition-colors duration-300">
                <ArrowUpRight size={24} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── POPUP MODAL ── */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-bg/80 backdrop-blur-xl"
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl bg-card border border-theme p-8 md:p-12 shadow-2xl rounded-[2rem] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Abstract decorative element */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

              <button 
                onClick={() => setSelectedCert(null)}
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-theme text-muted hover:text-accent transition-colors"
              >
                <X size={20} />
              </button>

              <div className="w-16 h-16 rounded-2xl bg-accent/20 text-accent flex items-center justify-center mb-8">
                <Award size={32} />
              </div>

              <div className="text-sm font-bold uppercase tracking-widest text-accent mb-4">
                {selectedCert.issueDate} // {selectedCert.issuer}
              </div>

              <h2 className="text-3xl md:text-4xl font-black text-theme leading-tight tracking-tighter mb-6">
                {selectedCert.title}
              </h2>

              <p className="text-lg text-muted leading-relaxed mb-10">
                {selectedCert.description || "Detailed description for this certification is currently unavailable."}
              </p>

              {selectedCert.link && (
                <a 
                  href={selectedCert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-theme hover:bg-accent text-theme hover:text-white font-bold uppercase tracking-widest text-sm rounded-full transition-colors"
                >
                  Verify Credential <ArrowUpRight size={18} />
                </a>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
