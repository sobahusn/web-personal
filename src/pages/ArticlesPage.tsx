import { motion } from "motion/react";
import { Calendar, Tag, ChevronRight, BookOpen, ArrowLeft, Clock } from "lucide-react";
import { ARTICLES } from "../constants/constants";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function ArticlesPage() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const article = ARTICLES.find((a) => a.id === selectedId);

  if (selectedId && article) {
    return (
      <div className="pt-[68px]">
        <div className="max-w-3xl mx-auto px-6 md:px-12 py-16">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <button
              onClick={() => setSelectedId(null)}
              className="flex items-center gap-2 text-muted hover:text-theme text-sm font-medium mb-10 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Articles
            </button>

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 text-xs text-muted font-mono mb-4 uppercase tracking-widest">
                <span
                  className="px-2.5 py-1 rounded-lg font-bold text-accent text-[11px]"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--accent) 10%, transparent)",
                  }}
                >
                  {article.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={12} /> {article.date}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-theme leading-tight mb-4">
                {article.title}
              </h1>
              <div className="w-12 h-1 rounded-full bg-accent" />
            </div>

            {/* Content */}
            <div className="prose text-muted leading-relaxed space-y-4 text-base">
              {article.content.split("\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[68px]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="section-divider" style={{ backgroundColor: "#8b5cf6" }} />
          <h1 className="text-4xl md:text-5xl font-bold text-theme mb-3 flex items-center gap-3">
            <BookOpen size={32} className="text-purple-500" />
            Articles
          </h1>
          <p className="text-muted">Thoughts, guides & developer journal</p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ARTICLES.map((art, i) => (
            <motion.button
              key={art.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedId(art.id)}
              className="group text-left bg-card rounded-2xl border border-theme p-6 hover:border-purple-400/40 hover:shadow-theme transition-all duration-300 flex flex-col h-full"
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className="text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg text-purple-500"
                  style={{ backgroundColor: "rgba(139,92,246,0.1)" }}
                >
                  {art.category}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted">
                  <Calendar size={12} />
                  {art.date}
                </span>
              </div>

              <h3 className="font-bold text-theme text-lg mb-3 leading-snug group-hover:text-purple-500 transition-colors">
                {art.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed mb-5 line-clamp-3 flex-1">
                {art.excerpt}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-theme">
                <span className="flex items-center gap-1.5 text-xs text-muted">
                  <Clock size={12} />
                  5 min read
                </span>
                <span className="flex items-center gap-1 text-purple-500 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Read More <ChevronRight size={14} />
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        {ARTICLES.length === 0 && (
          <div className="text-center py-24">
            <BookOpen size={40} className="text-muted mx-auto mb-4" />
            <p className="text-muted">No articles yet. Stay tuned!</p>
          </div>
        )}
      </div>
    </div>
  );
}
