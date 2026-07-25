import { motion } from "motion/react";
import { Send, MapPin, Mail, Globe } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../components/ui/Button";

export function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl px-4 md:px-0"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl font-bold text-vsc-text mb-6">
            Get In Touch
          </h2>
          <p className="text-vsc-text/70 mb-10 leading-relaxed text-lg">
            I'm always open to discussing new projects, creative ideas or
            opportunities to be part of your visions. Drop me a line!
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4 text-vsc-text/80">
              <div className="w-10 h-10 rounded bg-vsc-sidebar flex items-center justify-center text-vsc-accent border border-vsc-border">
                <MapPin size={20} />
              </div>
              <div>
                <div className="text-xs uppercase font-bold text-vsc-text/40 tracking-widest font-mono">
                  Location
                </div>
                <div className="text-sm">Remote / Jakarta, Indonesia</div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-vsc-text/80">
              <div className="w-10 h-10 rounded bg-vsc-sidebar flex items-center justify-center text-vsc-accent border border-vsc-border">
                <Mail size={20} />
              </div>
              <div>
                <div className="text-xs uppercase font-bold text-vsc-text/40 tracking-widest font-mono">
                  Email
                </div>
                <div className="text-sm">niam@example.com</div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-vsc-text/80">
              <div className="w-10 h-10 rounded bg-vsc-sidebar flex items-center justify-center text-vsc-accent border border-vsc-border">
                <Globe size={20} />
              </div>
              <div>
                <div className="text-xs uppercase font-bold text-vsc-text/40 tracking-widest font-mono">
                  Website
                </div>
                <div className="text-sm">www.myportfolio.dev</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-vsc-sidebar p-8 rounded-4xl border border-vsc-border shadow-xl">
          {submitted ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                <Send size={32} />
              </div>
              <h3 className="text-xl font-bold text-vsc-text">
                Message Received!
              </h3>
              <p className="text-vsc-text/60 text-sm">
                Thanks for reaching out. I'll get back to you as soon as
                possible.
              </p>
              <Button
                variant="link"
                onClick={() => setSubmitted(false)}
                className="text-sm font-semibold"
              >
                Send another message
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold text-vsc-text/40 tracking-widest font-mono">
                  Your Name
                </label>
                <input
                  required
                  type="text"
                  className="w-full bg-vsc-bg border border-vsc-border rounded-xl py-3 px-4 text-sm text-vsc-text focus:outline-none focus:border-vsc-accent transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold text-vsc-text/40 tracking-widest font-mono">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  className="w-full bg-vsc-bg border border-vsc-border rounded-xl py-3 px-4 text-sm text-vsc-text focus:outline-none focus:border-vsc-accent transition-all"
                  placeholder="niam@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold text-vsc-text/40 tracking-widest font-mono">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full bg-vsc-bg border border-vsc-border rounded-xl py-3 px-4 text-sm text-vsc-text focus:outline-none focus:border-vsc-accent resize-none transition-all"
                  placeholder="Tell me about your project..."
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                isLoading={isSubmitting}
                variant="primary"
                fullWidth
                rightIcon={<Send size={14} />}
                className="py-4 font-bold uppercase text-xs tracking-widest"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </motion.div>
  );
}
