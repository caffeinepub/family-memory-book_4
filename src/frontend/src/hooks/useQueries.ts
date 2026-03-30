import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Memory } from "../backend";
import { ExternalBlob } from "../backend";
import { useActor } from "./useActor";

export function useListMemories() {
  const { actor, isFetching } = useActor();
  return useQuery<Memory[]>({
    queryKey: ["memories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllMemories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListTags() {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["tags"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUniqueTags();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddMemory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      date: string;
      tags: string[];
      authorName: string;
      photo: File | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      let blobs: ExternalBlob[] = [];
      if (data.photo) {
        const bytes = new Uint8Array(await data.photo.arrayBuffer());
        blobs = [ExternalBlob.fromBytes(bytes)];
      }
      return actor.addMemory(
        data.title,
        data.description,
        data.date,
        data.tags,
        data.authorName,
        blobs,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memories"] });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
}

export function useEditMemory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      memoryId: string;
      title: string;
      description: string;
      date: string;
      tags: string[];
      authorName: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      // updateMemory is present in the backend but not yet reflected in the generated type;
      // cast to any to call it safely at runtime.
      return (actor as any).updateMemory(
        data.memoryId,
        data.title,
        data.description,
        data.date,
        data.tags,
        data.authorName,
      ) as Promise<void>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memories"] });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
}

export function useDeleteMemory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (memoryId: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteMemory(memoryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memories"] });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
}
