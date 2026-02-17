"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import SearchBar from "@/components/SearchBar";
import EventsGrid, { events } from "@/components/EventsGrid";
import Footer from "@/components/Footer";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeCity, setActiveCity] = useState<string | null>(null);

  const categories = useMemo(
    () => [...new Set(events.map((e) => e.category))].sort(),
    []
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
    []
  );

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !term ||
        event.title.toLowerCase().includes(term) ||
        event.artist.toLowerCase().includes(term) ||
        event.category.toLowerCase().includes(term) ||
        event.location.toLowerCase().includes(term);

      const matchesCategory =
        !activeCategory || event.category === activeCategory;

      const city = event.location.split(", ").pop() ?? "";
      const matchesCity = !activeCity || city === activeCity;

      return matchesSearch && matchesCategory && matchesCity;
    });
  }, [searchTerm, activeCategory, activeCity]);

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
        <EventsGrid filteredEvents={filteredEvents} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
