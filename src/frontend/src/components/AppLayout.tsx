import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  Heart,
  LayoutGrid,
  LayoutList,
  Plus,
  TreePine,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Memory } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useListMemories, useListTags } from "../hooks/useQueries";
import AddMemoryModal from "./AddMemoryModal";
import GalleryView from "./GalleryView";
import MemoryDetailModal from "./MemoryDetailModal";
import TimelineView from "./TimelineView";

const PREDEFINED_CATEGORIES = [
  "Weddings",
  "Birthdays",
  "Trips",
  "Holidays",
  "Milestones",
  "Everyday",
];

export default function AppLayout() {
  const { identity, clear } = useInternetIdentity();
  const [view, setView] = useState<"timeline" | "gallery">("timeline");
  const [activeTag, setActiveTag] = useState<string>("All");
  const [addOpen, setAddOpen] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  const { data: memories = [], isLoading: memoriesLoading } = useListMemories();
  const { data: tags = [] } = useListTags();

  const principal = identity?.getPrincipal().toString();
  const shortPrincipal = principal ? `${principal.slice(0, 8)}…` : "User";

  const filteredMemories =
    activeTag === "All"
      ? memories
      : memories.filter((m) => m.tags.includes(activeTag));

  const sortedMemories = [...filteredMemories].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  // Merge predefined categories with backend tags, deduplicating
  const tagsLower = tags.map((t) => t.toLowerCase());
  const extraCategories = PREDEFINED_CATEGORIES.filter(
    (c) => !tagsLower.includes(c.toLowerCase()),
  );
  const allFilterTags = ["All", ...extraCategories, ...tags];

  return (
    <div className="min-h-screen bg-background flex flex-col font-body">
      {/* Top nav */}
      <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur border-b border-border shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-teal flex items-center justify-center">
              <TreePine className="w-4 h-4 text-white" strokeWidth={1.8} />
            </div>
            <span className="font-heading text-xl font-semibold text-charcoal tracking-tight">
              Kinship
            </span>
          </div>

          {/* View switcher */}
          <div className="flex items-center gap-2 bg-cream-deep rounded-full p-1 border border-border relative">
            <button
              type="button"
              onClick={() => setView("timeline")}
              className="relative flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 z-10"
              style={{ color: view === "timeline" ? "white" : undefined }}
              data-ocid="app.tab"
            >
              {view === "timeline" && (
                <motion.div
                  layoutId="viewTab"
                  className="absolute inset-0 bg-teal rounded-full shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <LayoutList className="w-4 h-4" />
                <span className="hidden sm:inline">Timeline</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setView("gallery")}
              className="relative flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 z-10"
              style={{ color: view === "gallery" ? "white" : undefined }}
              data-ocid="app.tab"
            >
              {view === "gallery" && (
                <motion.div
                  layoutId="viewTab"
                  className="absolute inset-0 bg-teal rounded-full shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Gallery</span>
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              onClick={() => setAddOpen(true)}
              className="bg-teal text-white hover:bg-teal/90 rounded-full gap-1.5 shadow-warm hover:shadow-card-hover transition-all duration-300 text-sm px-3 sm:px-4"
              data-ocid="memory.open_modal_button"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Memory</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-sm font-medium text-warm-gray hover:text-charcoal transition-all duration-300"
                  data-ocid="user.dropdown_menu"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-8 h-8 rounded-full bg-gold flex items-center justify-center"
                  >
                    <span className="text-charcoal text-xs font-bold">
                      {shortPrincipal.charAt(0).toUpperCase()}
                    </span>
                  </motion.div>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover">
                <DropdownMenuItem className="text-xs text-muted-foreground font-mono">
                  {shortPrincipal}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={clear}
                  className="text-destructive focus:text-destructive"
                  data-ocid="user.delete_button"
                >
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Tag filter bar */}
      <div className="bg-cream-deep border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="overflow-x-auto scrollbar-hide -mx-4 sm:mx-0 px-4 sm:px-0">
            <div className="flex items-center gap-2 py-3 w-max">
              {allFilterTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag(tag)}
                  className="relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap"
                  data-ocid="memory.tab"
                >
                  {activeTag === tag && (
                    <motion.div
                      layoutId="activeTagBg"
                      className="absolute inset-0 bg-teal rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 35,
                      }}
                    />
                  )}
                  <span
                    className="relative z-10"
                    style={{
                      color: activeTag === tag ? "white" : undefined,
                    }}
                  >
                    {tag}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
        <AnimatePresence mode="wait">
          {memoriesLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-24"
              data-ocid="memory.loading_state"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  className="w-10 h-10 rounded-full border-4 border-teal border-t-transparent mx-auto mb-3"
                />
                <p className="text-muted-foreground text-sm">
                  Loading memories…
                </p>
              </div>
            </motion.div>
          ) : sortedMemories.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-24"
              data-ocid="memory.empty_state"
            >
              <div className="text-center max-w-sm">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className="w-16 h-16 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-5"
                >
                  <Heart className="w-7 h-7 text-gold-dark" />
                </motion.div>
                <h3 className="font-heading text-xl text-charcoal mb-2">
                  No memories yet
                </h3>
                <p className="text-warm-gray text-sm mb-6">
                  {activeTag !== "All"
                    ? `No memories tagged "${activeTag}". Try a different filter.`
                    : "Start capturing your family's precious moments."}
                </p>
                {activeTag === "All" && (
                  <Button
                    onClick={() => setAddOpen(true)}
                    className="bg-teal text-white hover:bg-teal/90 rounded-full shadow-warm"
                    data-ocid="memory.primary_button"
                  >
                    <Plus className="w-4 h-4 mr-1.5" />
                    Add Your First Memory
                  </Button>
                )}
              </div>
            </motion.div>
          ) : view === "timeline" ? (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <TimelineView
                memories={sortedMemories}
                onSelect={setSelectedMemory}
              />
            </motion.div>
          ) : (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <GalleryView
                memories={sortedMemories}
                onSelect={setSelectedMemory}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-cream-deep border-t border-border py-4 px-6 text-center">
        <p className="text-xs text-warm-gray">© {new Date().getFullYear()}</p>
        <p className="text-xs text-warm-gray">Made by Alishba Tanveer</p>
      </footer>

      {/* Modals */}
      <AddMemoryModal open={addOpen} onOpenChange={setAddOpen} />
      {selectedMemory && (
        <MemoryDetailModal
          memory={selectedMemory}
          open={!!selectedMemory}
          onOpenChange={(o) => !o && setSelectedMemory(null)}
          currentPrincipal={principal}
        />
      )}
    </div>
  );
}
