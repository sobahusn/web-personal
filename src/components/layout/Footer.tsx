import { Link } from "react-router-dom";
import { IconBrandGithub, IconBrandLinkedin } from "@tabler/icons-react";
import { Mail } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-theme overflow-hidden border-t border-theme">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16 md:mb-24">
          
          {/* Col 1: Huge Brand */}
          <div className="md:col-span-8 flex flex-col justify-between">
            <div>
              <h2 className="text-6xl md:text-8xl lg:text-[9rem] font-black leading-[0.8] tracking-tighter text-theme mb-6 hover:text-accent transition-colors duration-500 cursor-default">
                SOBAHUSN<span className="text-accent">.</span>
              </h2>
              <p className="text-xl md:text-2xl font-bold text-muted uppercase tracking-widest max-w-lg">
                Software Engineer <br/>
                <span className="text-theme">Building the future</span>
              </p>
            </div>
          </div>

          {/* Col 2 & 3: Nav and Socials */}
          <div className="md:col-span-4 flex flex-col sm:flex-row gap-12 sm:gap-24 md:justify-end">
            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-muted mb-2">Navigation</h4>
              {[
                { label: "Home", to: "/" },
                { label: "Works", to: "/projects" },
                { label: "Certificate", to: "/certificate" },
                { label: "About", to: "/about" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-lg md:text-xl font-bold text-theme hover:text-accent hover:translate-x-2 transition-all w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-muted mb-2">Connect</h4>
              <a
                href="https://github.com/sobahusn"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-lg md:text-xl font-bold text-theme hover:text-accent transition-colors w-fit"
              >
                <IconBrandGithub size={24} className="group-hover:-rotate-12 transition-transform" />
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/sobahus-niam"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-lg md:text-xl font-bold text-theme hover:text-accent transition-colors w-fit"
              >
                <IconBrandLinkedin size={24} className="group-hover:-rotate-12 transition-transform" />
                LinkedIn
              </a>
              <a
                href="mailto:sobahusn27@gmail.com"
                className="group flex items-center gap-3 text-lg md:text-xl font-bold text-theme hover:text-accent transition-colors w-fit"
              >
                <Mail size={24} className="group-hover:-rotate-12 transition-transform" />
                Email
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Brutalist Ledger */}
        <div className="border-t-2 border-theme pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-4 md:gap-8 text-xs md:text-sm font-bold uppercase tracking-widest text-muted">
            <span>© {year} ALL RIGHTS RESERVED</span>
            <span className="hidden md:inline-block w-1.5 h-1.5 bg-accent rounded-full" />
            <span>SIDOARJO, INDONESIA</span>
            <span className="hidden md:inline-block w-1.5 h-1.5 bg-accent rounded-full" />
            <span>ID // REMOTE</span>
          </div>
          
          <div className="text-xs font-mono text-muted uppercase tracking-[0.2em] px-4 py-2 bg-card border border-theme rounded-full shadow-inner">
            System Online
          </div>
        </div>
      </div>
    </footer>
  );
}
