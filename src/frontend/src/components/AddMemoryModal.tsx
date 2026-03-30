import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Loader2, Upload, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Memory } from "../backend";
import { useAddMemory, useEditMemory } from "../hooks/useQueries";

const CATEGORY_CHIPS = [
  "Weddings",
  "Birthdays",
  "Trips",
  "Holidays",
  "Milestones",
  "Everyday",
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editMemory?: Memory | null;
}

export default function AddMemoryModal({
  open,
  onOpenChange,
  editMemory,
}: Props) {
  const isEditMode = !!editMemory;
  const addMemory = useAddMemory();
  const editMemoryMutation = useEditMemory();
  const isPending = isEditMode
    ? editMemoryMutation.isPending
    : addMemory.isPending;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Populate fields when editing
  useEffect(() => {
    if (editMemory && open) {
      setTitle(editMemory.title);
      setDescription(editMemory.description);
      setDate(editMemory.date);
      setTagsInput(editMemory.tags.join(", "));
      setAuthorName(editMemory.authorName);
    }
  }, [editMemory, open]);

  const reset = () => {
    setTitle("");
    setDescription("");
    setDate("");
    setTagsInput("");
    setAuthorName("");
    setPhoto(null);
    setIsDragging(false);
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
      setPhotoPreview(null);
    }
  };

  const applyFile = (file: File) => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) applyFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith("image/")) applyFile(file);
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
      setPhotoPreview(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const toggleChip = (chip: string) => {
    const current = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const idx = current.findIndex(
      (t) => t.toLowerCase() === chip.toLowerCase(),
    );
    if (idx >= 0) {
      current.splice(idx, 1);
    } else {
      current.push(chip);
    }
    setTagsInput(current.join(", "));
  };

  const isChipActive = (chip: string) => {
    return tagsInput
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .includes(chip.toLowerCase());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date || !authorName.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    try {
      if (isEditMode && editMemory) {
        await editMemoryMutation.mutateAsync({
          memoryId: editMemory.id,
          title: title.trim(),
          description: description.trim(),
          date,
          tags,
          authorName: authorName.trim(),
        });
        toast.success("Memory updated!");
      } else {
        await addMemory.mutateAsync({
          title: title.trim(),
          description: description.trim(),
          date,
          tags,
          authorName: authorName.trim(),
          photo,
        });
        toast.success("Memory saved!");
      }
      reset();
      onOpenChange(false);
    } catch {
      toast.error(
        isEditMode
          ? "Failed to update memory. Please try again."
          : "Failed to save memory. Please try again.",
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onOpenChange(o);
      }}
    >
      <DialogContent
        className="bg-popover w-full sm:max-w-lg max-h-[90vh] overflow-y-auto"
        data-ocid="memory.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl text-charcoal">
            {isEditMode ? "Edit Memory" : "Add a Memory"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Photo upload — only in add mode */}
          {!isEditMode && (
            <div>
              <Label className="text-sm font-medium text-charcoal mb-2 block">
                Photo (optional)
              </Label>
              {photoPreview ? (
                <div className="relative rounded-2xl overflow-hidden aspect-video">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-charcoal/70 backdrop-blur flex items-center justify-center text-white hover:bg-charcoal transition-all duration-300 shadow-sm"
                    data-ocid="memory.close_button"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <motion.button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  animate={isDragging ? { scale: 1.02 } : { scale: 1 }}
                  className={`w-full border-2 border-dashed rounded-2xl p-10 flex flex-col items-center gap-3 transition-all duration-300 ${
                    isDragging
                      ? "border-gold bg-gold/10"
                      : "border-border hover:border-gold-dark/60 hover:bg-gold/5"
                  }`}
                  data-ocid="memory.upload_button"
                >
                  <motion.div
                    animate={
                      isDragging
                        ? {
                            y: [-4, 4, -4],
                            transition: {
                              duration: 0.6,
                              repeat: Number.POSITIVE_INFINITY,
                            },
                          }
                        : { y: 0 }
                    }
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isDragging ? "bg-gold/20" : "bg-cream-deep"
                    }`}
                  >
                    <Camera
                      className={`w-7 h-7 transition-all duration-300 ${
                        isDragging ? "text-gold-dark" : "text-warm-gray"
                      }`}
                      strokeWidth={1.5}
                    />
                  </motion.div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-charcoal">
                      Drop a photo here
                    </p>
                    <p className="text-xs text-warm-gray mt-1">
                      or{" "}
                      <span className="text-teal font-medium">
                        click to browse
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Upload className="w-3 h-3" />
                    JPG, PNG, WebP up to 10MB
                  </div>
                </motion.button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="mem-title"
                className="text-sm font-medium text-charcoal mb-1.5 block"
              >
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="mem-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Christmas Morning"
                className="bg-background border-border focus:border-teal transition-all duration-300 w-full"
                data-ocid="memory.input"
                required
              />
            </div>
            <div>
              <Label
                htmlFor="mem-date"
                className="text-sm font-medium text-charcoal mb-1.5 block"
              >
                Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="mem-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-background border-border focus:border-teal transition-all duration-300 w-full"
                data-ocid="memory.input"
                required
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="mem-author"
              className="text-sm font-medium text-charcoal mb-1.5 block"
            >
              Your Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="mem-author"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Grandma Rose"
              className="bg-background border-border focus:border-teal transition-all duration-300 w-full"
              data-ocid="memory.input"
              required
            />
          </div>

          <div>
            <Label
              htmlFor="mem-desc"
              className="text-sm font-medium text-charcoal mb-1.5 block"
            >
              Description
            </Label>
            <Textarea
              id="mem-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Share the story behind this memory…"
              rows={3}
              className="bg-background border-border resize-none focus:border-teal transition-all duration-300 w-full"
              data-ocid="memory.textarea"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-charcoal mb-2 block">
              Categories
            </Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {CATEGORY_CHIPS.map((chip) => {
                const active = isChipActive(chip);
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => toggleChip(chip)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${
                      active
                        ? "bg-gold text-charcoal border-gold shadow-sm"
                        : "bg-background text-warm-gray border-border hover:border-gold/60 hover:text-charcoal"
                    }`}
                    data-ocid="memory.toggle"
                  >
                    {chip}
                  </button>
                );
              })}
            </div>
            <Label
              htmlFor="mem-tags"
              className="text-sm font-medium text-charcoal mb-1.5 block"
            >
              Tags
            </Label>
            <Input
              id="mem-tags"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Holiday, Family, Travel"
              className="bg-background border-border focus:border-teal transition-all duration-300 w-full"
              data-ocid="memory.input"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Separate tags with commas
            </p>
          </div>

          <div className="flex gap-3 pt-1 pb-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-border hover:border-charcoal/30 transition-all duration-300"
              data-ocid="memory.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-teal text-white hover:bg-teal/90 shadow-warm hover:shadow-card-hover transition-all duration-300"
              data-ocid="memory.submit_button"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isEditMode ? "Saving…" : "Saving…"}
                </>
              ) : isEditMode ? (
                "Save Changes"
              ) : (
                "Save Memory"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
