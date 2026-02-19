"use client";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { fetchEvents, fetchEventBySlug, fetchCategories, type FetchEventsParams } from "@/lib/api";

export function useEvents(params: FetchEventsParams = {}) {
  return useQuery({
    queryKey: ["events", params],
    queryFn: () => fetchEvents(params),
  });
}

export function useInfiniteEvents(params: Omit<FetchEventsParams, "page"> = {}) {
  return useInfiniteQuery({
    queryKey: ["events-infinite", params],
    queryFn: ({ pageParam }) => fetchEvents({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.current_page < lastPage.meta.last_page
        ? lastPage.meta.current_page + 1
        : undefined,
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
