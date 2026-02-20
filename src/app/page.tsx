"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import SearchBar from "@/components/SearchBar";
import EventsGrid from "@/components/EventsGrid";
import Footer from "@/components/Footer";
import { useInfiniteEvents } from "@/hooks/use-events";
import { mapApiEventToEvent } from "@/data/events";
import { EventsGridSkeleton, HeroCarouselSkeleton } from "@/components/skeletons";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeCity, setActiveCity] = useState<string | null>(null);

  const {
    data,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteEvents({ per_page: 24 });

  const events = useMemo(
    () => (data?.pages ?? []).flatMap((page) => page.data.map(mapApiEventToEvent)),
    [data]
  );

  const categories = useMemo(
    () => [...new Set(events.map((e) => e.category))].sort(),
    [events]
  );

  const cities = useMemo(
    () =>
      [
        ...new Set(
          events.map((e) => {
            const parts = e.location.split(", ");
            return parts[parts.length - 1];
          })
        ),
      ].sort(),
    [events]
  );

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !term ||
        event.title.toLowerCase().includes(term) ||
        event.subtitle.toLowerCase().includes(term) ||
        event.category.toLowerCase().includes(term) ||
        event.location.toLowerCase().includes(term);

      const matchesCategory =
        !activeCategory || event.category === activeCategory;

      const city = event.location.split(", ").pop() ?? "";
      const matchesCity = !activeCity || city === activeCity;

      return matchesSearch && matchesCategory && matchesCity;
    });
  }, [events, searchTerm, activeCategory, activeCity]);

  const isFiltering = !!(searchTerm || activeCategory || activeCity);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 lg:pt-20">
        <HeroCarousel />
        <SearchBar
          onSearch={setSearchTerm}
          onFilterCategory={setActiveCategory}
          onFilterCity={setActiveCity}
          categories={categories}
          cities={cities}
          activeCategory={activeCategory}
          activeCity={activeCity}
        />
        {isLoading ? (
          <div className="px-4">
            <div className="container mx-auto py-12">
              <EventsGridSkeleton count={8} />
            </div>
          </div>
        ) : (
          <EventsGrid
            events={filteredEvents}
            hasNextPage={!isFiltering && hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onLoadMore={() => fetchNextPage()}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
