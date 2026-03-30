# Family Memory Book

## Current State
- Full-stack app with Motoko backend and React/Tailwind frontend
- Memories have: id, title, description, date, tags, authorId, authorName, blobIds, createdAt
- Backend supports: addMemory, deleteMemory, listAllMemories, getAllUniqueTags, getMemoryById
- Frontend has: LandingPage, AppLayout, TimelineView, GalleryView, AddMemoryModal, MemoryDetailModal
- Authorization (Internet Identity) already active — family-only access
- Photo upload via blob-storage already works
- Modern UI with animations recently applied

## Requested Changes (Diff)

### Add
- `updateMemory` backend function to edit title, description, date, tags, authorName of an existing memory
- Edit memory modal (reuse AddMemoryModal with pre-filled values)
- Predefined category chips in AddMemoryModal: Weddings, Birthdays, Trips, Holidays, Milestones, Everyday
- Edit button visible on MemoryDetailModal for memory owners
- `useEditMemory` mutation hook in useQueries.ts

### Modify
- AddMemoryModal: Add category quick-select chips above the tags input; clicking a chip adds it to tags. Improve date input with better styling.
- MemoryDetailModal: Add Edit button (pencil icon) for owners alongside Delete; clicking opens the edit modal pre-filled
- AppLayout: Category filter chips include predefined categories at the top of the tag filter bar

### Remove
- Nothing removed

## Implementation Plan
1. Add `updateMemory(memoryId, title, description, date, tags, authorName)` to main.mo — only author or admin can edit
2. Regenerate backend.d.ts bindings
3. Add `useEditMemory` mutation in useQueries.ts
4. Create EditMemoryModal (or refactor AddMemoryModal to handle both add and edit modes)
5. Update MemoryDetailModal to show Edit button and open EditMemoryModal
6. Add predefined category chips to AddMemoryModal and EditMemoryModal
7. Update AppLayout tag filter bar with predefined category labels
