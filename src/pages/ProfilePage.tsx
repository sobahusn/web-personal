import { motion } from "motion/react";
import {
  Code2,
  Palette,
  Database,
  Cloud,
  Mail,
  MapPin,
} from "lucide-react";

import { IconBrandLinkedinFilled as Linkedin, IconBrandGithub as Github  } from "@tabler/icons-react";

export function ProfilePage() {
  const skills = [
    {
      title: "Frontend",
      icon: Palette,
      items: [
        "React",
        "Next.js",
        "Tailwind CSS",
        "Framer Motion",
        "TypeScript",
      ],
    },
    {
      title: "Backend",
      icon: Database,
      items: ["Node.js", "Express", "PostgreSQL", "MongoDB", "Redis"],
    },
    {
      title: "DevOps",
      icon: Cloud,
      items: ["Docker", "AWS", "Google Cloud", "CI/CD", "Kubernetes"],
    },
    {
      title: "Languages",
      icon: Code2,
      items: ["JavaScript", "TypeScript", "Python", "Go", "PHP"],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl space-y-16 px-4 md:px-0"
    >
      <section>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-8 space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-vsc-text mb-2">
                M. Sobahus Sururin Ni'am
              </h2>
              <p className="text-vsc-accent font-medium flex items-center gap-2">
                <MapPin size={14} /> Based in Indonesia, Remote Friendly
              </p>
            </div>

            <div className="space-y-4 text-vsc-text/80 leading-relaxed text-lg">
              <p>
                I am a multi-disciplinary software engineer who thrives at the
                intersection of <strong>system architecture</strong> and{" "}
                <strong>human-centric design</strong>. With a deep background in
                full-stack development, I focus on creating digital products
                that are as performant as they are beautiful.
              </p>
              <p>
                Currently, I am heavily focused on{" "}
                <strong>AI orchestration</strong> and{" "}
                <strong>LLM integration</strong>, exploring how generative
                intelligence can be seamlessly woven into modern web
                applications to solve real-world problems.
              </p>
            </div>

            <div className="flex gap-4">
              <a
                href="https://github.com/sobahusn"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-vsc-highlight/20 hover:bg-vsc-highlight/40 rounded-full transition-colors font-bold backdrop-blur-md flex items-center gap-2 active:scale-95"
              >
                <Github size={20} />
              </a>
              <a
                href="https://linkedin.com/in/sobahus-niam"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-vsc-highlight/20 hover:bg-vsc-highlight/40 rounded-full transition-colors font-bold backdrop-blur-md flex items-center gap-2 active:scale-95"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="mailto:sobahusn27@gmail.com"
                className="p-3 bg-vsc-highlight/20 hover:bg-vsc-highlight/40 rounded-full transition-colors font-bold backdrop-blur-md flex items-center gap-2 active:scale-95"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div className="md:col-span-4">
            <div className="relative group mx-auto max-w-60 md:max-w-none">
              <div className="absolute top-4 left-4 w-full h-full border-2 border-vsc-accent rounded-xl -z-10 bg-vsc-accent/5 group-hover:top-2 group-hover:left-2 transition-all duration-300"></div>
              <img
                src="https://github.com/sobahusn.png"
                alt="Portrait"
                className="relative rounded-xl border border-vsc-border w-full aspect-square object-cover shadow-2xl transition-all duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-vsc-text mb-8">
          Technical Arsenal
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {skills.map((skill) => (
            <div
              key={skill.title}
              className="p-5 bg-vsc-sidebar border border-vsc-border rounded-xl hover:border-vsc-accent transition-colors group"
            >
              <skill.icon
                className="text-vsc-text/40 group-hover:text-vsc-accent mb-4 transition-colors"
                size={28}
              />
              <h3 className="font-bold text-vsc-text mb-3">{skill.title}</h3>
              <div className="flex flex-wrap gap-2">
                {skill.items.map((item) => (
                  <span
                    key={item}
                    className="text-[10px] px-2 py-1 bg-vsc-highlight/20 text-vsc-text/60 rounded border border-vsc-border/50"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
