"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchEvents, fetchEventBySlug, fetchCategories, type FetchEventsParams } from "@/lib/api";

export function useEvents(params: FetchEventsParams = {}) {
  return useQuery({
    queryKey: ["events", params],
    queryFn: () => fetchEvents(params),
  });
}

export function useEventBySlug(slug: string) {
  return useQuery({
    queryKey: ["event", slug],
    queryFn: () => fetchEventBySlug(slug),
    enabled: !!slug,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
}
