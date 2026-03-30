import { Calendar, ImageIcon, User } from "lucide-react";
import { motion } from "motion/react";
import type { Memory } from "../backend";

interface Props {
  memories: Memory[];
  onSelect: (memory: Memory) => void;
}

function MemoryPhoto({ memory }: { memory: Memory }) {
  if (memory.blobIds.length > 0) {
    return (
      <img
        src={memory.blobIds[0].getDirectURL()}
        alt={memory.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
    );
  }
  return (
    <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
      <ImageIcon className="w-8 h-8 text-gold-dark/60" />
    </div>
  );
}

export default function TimelineView({ memories, onSelect }: Props) {
  const byYear = memories.reduce<Record<string, Memory[]>>((acc, m) => {
    const year = new Date(m.date).getFullYear().toString();
    if (!acc[year]) acc[year] = [];
    acc[year].push(m);
    return acc;
  }, {});

  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="relative">
      {/* Gradient vertical line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 timeline-line" />

      <div className="space-y-12 pl-16">
        {years.map((year, yi) => (
          <div key={year}>
            {/* Year bubble */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: yi * 0.04 }}
              className="relative -ml-16 mb-7"
            >
              <div className="absolute left-0 flex items-center">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-teal to-[oklch(0.38_0.068_195)] flex items-center justify-center shadow-warm cursor-default"
                >
                  <span className="text-white text-xs font-bold tracking-wide">
                    {year}
                  </span>
                </motion.div>
              </div>
              <div className="ml-16 pl-5">
                <h3 className="font-heading text-3xl text-charcoal">{year}</h3>
                <p className="text-xs text-warm-gray mt-0.5">
                  {byYear[year].length}{" "}
                  {byYear[year].length === 1 ? "memory" : "memories"}
                </p>
              </div>
            </motion.div>

            <div className="space-y-5">
              {byYear[year].map((memory, mi) => (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: mi * 0.06 }}
                  className="relative"
                >
                  <div className="absolute -left-10 top-5 w-3 h-3 rounded-full bg-gold border-2 border-gold-dark shadow-sm" />
                  <button
                    type="button"
                    onClick={() => onSelect(memory)}
                    className="w-full text-left bg-card rounded-2xl p-5 shadow-card border border-border hover:border-gold-dark/50 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden"
                    data-ocid={`memory.item.${mi + 1}`}
                  >
                    {/* Left accent bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-0 group-hover:w-1 bg-gold rounded-l-2xl transition-all duration-300" />

                    <div className="flex gap-5">
                      <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 shadow-sm">
                        <MemoryPhoto memory={memory} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading text-lg text-charcoal font-semibold mb-1 group-hover:text-teal transition-colors duration-300 truncate">
                          {memory.title}
                        </h4>
                        <div className="flex items-center gap-3 mb-2.5 text-xs text-warm-gray">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(memory.date).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {memory.authorName}
                          </span>
                        </div>
                        <p className="text-sm text-warm-gray line-clamp-2 mb-3 leading-relaxed">
                          {memory.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {memory.tags.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2.5 py-0.5 rounded-full bg-gold/20 text-charcoal border border-gold/40 group-hover:bg-gold/30 transition-all duration-300"
                            >
                              {tag}
                            </span>
                          ))}
                          {memory.tags.length > 4 && (
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                              +{memory.tags.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
