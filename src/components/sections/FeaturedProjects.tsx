import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PROJECTS } from "../../constants/constants";

export function FeaturedProjects() {
  const featured = PROJECTS.filter((p) => p.featured).slice(0, 3);

  return (
    <section className="py-32 bg-theme overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-7xl font-black text-theme uppercase tracking-tighter leading-none mb-6">
              Selected Works
            </h2>
            <p className="text-muted text-lg font-medium">
              A curated collection of projects highlighting my expertise in
              crafting scalable architectures, intuitive interfaces, and robust
              backend systems.
            </p>
          </div>
          <Link
            to="/projects"
            className="flex items-center justify-between gap-3 px-6 py-3 rounded-full border border-theme text-theme font-bold uppercase tracking-widest text-xs hover:bg-theme hover:text-accent transition-all group shrink-0"
          >
            View All Projects
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {/* Project Stack */}
        <div className="flex flex-col gap-32">
          {featured.map((project, i) => {
            const isEven = i % 2 === 0;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className={`flex flex-col  ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-12 lg:gap-20 items-center group`}
              >
                {/* Image Side */}
                <div className="w-full lg:w-1/2 relative aspect-video">
                  <Link
                    to={`/projects/${project.id}`}
                    className="block relative rounded-3xl overflow-hidden shadow-theme-lg border border-theme bg-card"
                  >
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover lg:grayscale lg:opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-[0.16,1,0.3,1]"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center p-8">
                        <span className="text-muted">Image not available</span>
                      </div>
                    )}
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 mix-blend-overlay transition-opacity duration-500" />

                    {/* View Project Button floating in center on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="w-20 h-20 bg-theme/90 backdrop-blur-md rounded-full flex items-center justify-center text-accent shadow-theme-lg scale-50 group-hover:scale-100 transition-transform duration-500 ease-[0.16,1,0.3,1]">
                        <ArrowUpRight size={32} />
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Content Side */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-6 justify-between">
                    <span className="text-xs font-bold px-3 py-1 rounded-full border border-theme text-accent tracking-widest uppercase">
                      {project.category}
                    </span>
                  </div>

                  <Link to={`/projects/${project.id}`}>
                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-theme leading-none tracking-tighter mb-6 group-hover:text-accent transition-colors duration-300">
                      {project.title}
                    </h3>
                  </Link>

                  <p className="text-muted text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-10">
                    {project.tags.slice(0, 4).map((tag) => (
                      <div
                        key={tag}
                        className="text-xs px-4 py-2 rounded-full font-mono bg-card border border-theme text-muted hover:text-theme transition-colors cursor-default"
                      >
                        {tag}
                      </div>
                    ))}
                  </div>

                  <Link
                    to={`/projects/${project.id}`}
                    className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-theme hover:text-accent transition-colors w-fit pb-1 border-b-2 border-transparent hover:border-accent"
                  >
                    Read Case Study
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
