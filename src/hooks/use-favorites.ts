"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { fetchMyFavorites, checkFavorites, toggleFavorite } from "@/lib/api";

export function useMyFavorites(page?: number) {
  const { data: session } = useSession();
  return useQuery({
    queryKey: ["my-favorites", session?.accessToken, page],
    queryFn: () => fetchMyFavorites(session!.accessToken, page),
    enabled: !!session?.accessToken,
  });
}

export function useCheckFavorites(eventIds: number[]) {
  const { data: session } = useSession();
  return useQuery({
    queryKey: ["check-favorites", session?.accessToken, eventIds],
    queryFn: () => checkFavorites(session!.accessToken, eventIds),
    enabled: !!session?.accessToken && eventIds.length > 0,
  });
}

export function useToggleFavorite() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: number) => toggleFavorite(session!.accessToken, eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-favorites"] });
      queryClient.invalidateQueries({ queryKey: ["check-favorites"] });
    },
  });
}
