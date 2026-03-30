import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  ImageIcon,
  Loader2,
  Pencil,
  Trash2,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Memory } from "../backend";
import { useDeleteMemory } from "../hooks/useQueries";
import AddMemoryModal from "./AddMemoryModal";

interface Props {
  memory: Memory;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPrincipal?: string;
}

const TAG_COLORS = [
  "bg-gold/20 text-charcoal border-gold/40",
  "bg-teal/15 text-teal border-teal/30",
  "bg-rose-100 text-rose-800 border-rose-200",
  "bg-emerald-100 text-emerald-800 border-emerald-200",
  "bg-sky-100 text-sky-800 border-sky-200",
  "bg-purple-100 text-purple-800 border-purple-200",
];

export default function MemoryDetailModal({
  memory,
  open,
  onOpenChange,
  currentPrincipal,
}: Props) {
  const deleteMemory = useDeleteMemory();
  const isOwner =
    currentPrincipal && memory.authorId.toString() === currentPrincipal;
  const [editOpen, setEditOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteMemory.mutateAsync(memory.id);
      toast.success("Memory deleted.");
      onOpenChange(false);
    } catch {
      toast.error("Failed to delete memory.");
    }
  };

  const handleEditClose = (o: boolean) => {
    setEditOpen(o);
    if (!o) {
      // Optionally close detail modal after edit
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="bg-popover max-w-2xl p-0 overflow-hidden"
          data-ocid="memory.dialog"
        >
          {/* Full-width photo hero */}
          <div className="relative w-full aspect-video bg-muted overflow-hidden">
            {memory.blobIds.length > 0 ? (
              <motion.img
                initial={{ scale: 1.05, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                src={memory.blobIds[0].getDirectURL()}
                alt={memory.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-200 flex items-center justify-center"
              >
                <ImageIcon className="w-16 h-16 text-gold-dark/40" />
              </motion.div>
            )}
            {/* Gradient over photo */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
            {/* Title overlaid on photo */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="font-heading text-2xl md:text-3xl text-white font-bold leading-tight drop-shadow-md"
              >
                {memory.title}
              </motion.h2>
            </div>
          </div>

          {/* Body */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="p-6 space-y-5"
          >
            {/* DialogHeader for accessibility */}
            <DialogHeader className="hidden">
              <DialogTitle>{memory.title}</DialogTitle>
            </DialogHeader>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-warm-gray">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-teal" />
                {new Date(memory.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-teal" />
                {memory.authorName}
              </span>
            </div>

            {/* Description */}
            {memory.description && (
              <p className="text-charcoal text-sm leading-relaxed">
                {memory.description}
              </p>
            )}

            {/* Tags */}
            {memory.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {memory.tags.map((tag, i) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className={`text-xs px-3 py-1 rounded-full border font-medium ${
                      TAG_COLORS[i % TAG_COLORS.length]
                    }`}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between items-center pt-1">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-border hover:border-charcoal/30 transition-all duration-300"
                data-ocid="memory.close_button"
              >
                Close
              </Button>
              {isOwner && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditOpen(true)}
                    className="bg-teal/10 text-teal border-teal/30 hover:bg-teal/20 transition-all duration-300"
                    data-ocid="memory.edit_button"
                  >
                    <Pencil className="w-4 h-4 mr-1.5" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="text-destructive border-destructive/30 hover:bg-destructive/10 transition-all duration-300"
                        data-ocid="memory.open_modal_button"
                      >
                        <Trash2 className="w-4 h-4 mr-1.5" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent data-ocid="memory.dialog">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this memory?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. The memory and its photo
                          will be permanently removed.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel data-ocid="memory.cancel_button">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          disabled={deleteMemory.isPending}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          data-ocid="memory.confirm_button"
                        >
                          {deleteMemory.isPending ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Deleting…
                            </>
                          ) : (
                            "Delete Memory"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Edit modal */}
      <AddMemoryModal
        open={editOpen}
        onOpenChange={handleEditClose}
        editMemory={memory}
      />
    </>
  );
}
