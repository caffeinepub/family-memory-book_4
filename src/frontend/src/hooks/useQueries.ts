import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Memory } from "../backend";
import { ExternalBlob } from "../backend";
import { useActor } from "./useActor";

export function useListMemories() {
  const { actor } = useActor();
  return useQuery<Memory[]>({
    queryKey: ["memories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllMemories();
    },
    enabled: !!actor,
  });
}

export function useListTags() {
  const { actor } = useActor();
  return useQuery<string[]>({
    queryKey: ["tags"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUniqueTags();
    },
    enabled: !!actor,
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
      queryClient.refetchQueries({ queryKey: ["memories"] });
      queryClient.refetchQueries({ queryKey: ["tags"] });
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
      return actor.updateMemory(
        data.memoryId,
        data.title,
        data.description,
        data.date,
        data.tags,
        data.authorName,
      );
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["memories"] });
      queryClient.refetchQueries({ queryKey: ["tags"] });
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
      queryClient.refetchQueries({ queryKey: ["memories"] });
      queryClient.refetchQueries({ queryKey: ["tags"] });
    },
  });
}
