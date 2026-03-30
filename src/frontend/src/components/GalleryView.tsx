import { Calendar, ImageIcon } from "lucide-react";
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
  const gradients = [
    "from-amber-100 to-orange-200",
    "from-rose-100 to-pink-200",
    "from-sky-100 to-blue-200",
    "from-emerald-100 to-teal-200",
    "from-purple-100 to-violet-200",
    "from-yellow-100 to-amber-200",
  ];
  const grad = gradients[Math.abs(memory.id.charCodeAt(0)) % gradients.length];
  return (
    <div
      className={`w-full h-full bg-gradient-to-br ${grad} flex items-center justify-center transition-transform duration-500 group-hover:scale-110`}
    >
      <ImageIcon className="w-8 h-8 text-gold-dark/50" />
    </div>
  );
}

/** Alternate aspect ratios for masonry feel */
function getAspect(i: number): string {
  const pattern = [
    "aspect-[3/4]",
    "aspect-square",
    "aspect-square",
    "aspect-[3/4]",
    "aspect-square",
    "aspect-[4/3]",
  ];
  return pattern[i % pattern.length];
}

export default function GalleryView({ memories, onSelect }: Props) {
  return (
    <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-0">
      {memories.map((memory, i) => (
        <motion.button
          key={memory.id}
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: (i % 8) * 0.05 }}
          whileHover={{ scale: 1.02, zIndex: 10 }}
          onClick={() => onSelect(memory)}
          className={`group relative ${getAspect(i)} rounded-2xl overflow-hidden shadow-card border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring mb-4 block w-full transition-shadow duration-300 hover:shadow-card-hover`}
          data-ocid={`memory.item.${i + 1}`}
        >
          <MemoryPhoto memory={memory} />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <p className="text-white text-sm font-semibold line-clamp-2 leading-snug">
              {memory.title}
            </p>
            <p className="text-white/70 text-xs flex items-center gap-1 mt-1.5">
              <Calendar className="w-3 h-3" />
              {new Date(memory.date).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </p>
            {memory.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {memory.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.button>
      ))}
    </div>
  );
}
