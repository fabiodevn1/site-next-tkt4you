"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import { events } from "@/data/events";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Events = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

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

  const hasActiveFilters = activeCategory || activeCity;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 lg:pt-28 pb-16 px-4">
        <div className="container mx-auto">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            <span className="cosmic-text">Todos os Eventos</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Explore todos os eventos disponíveis e encontre o seu próximo ingresso.
          </p>

          {/* Search & Filters */}
          <div className="bg-card rounded-2xl p-4 md:p-6 shadow-lg border border-border/50 mb-10">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar eventos, artistas, festivais..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 rounded-xl bg-muted border-2 border-transparent focus:border-primary focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <Button
                variant={showFilters || hasActiveFilters ? "default" : "outline"}
                size="lg"
                className="h-14 px-5 rounded-xl relative"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-5 h-5 mr-2" />
                Filtros
                {hasActiveFilters && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground rounded-full text-xs flex items-center justify-center font-bold">
                    {(activeCategory ? 1 : 0) + (activeCity ? 1 : 0)}
                  </span>
                )}
              </Button>
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t border-border/50 flex flex-wrap items-center gap-3">
                <Select
                  value={activeCategory ?? "all"}
                  onValueChange={(val) => setActiveCategory(val === "all" ? null : val)}
                >
                  <SelectTrigger className="w-[180px] h-11 rounded-lg">
                    <SelectValue placeholder="Gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os gêneros</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={activeCity ?? "all"}
                  onValueChange={(val) => setActiveCity(val === "all" ? null : val)}
                >
                  <SelectTrigger className="w-[180px] h-11 rounded-lg">
                    <SelectValue placeholder="Cidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as cidades</SelectItem>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {hasActiveFilters && (
                  <button
                    onClick={() => {
                      setActiveCategory(null);
                      setActiveCity(null);
                    }}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Limpar
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Results */}
          <p className="text-sm text-muted-foreground mb-6">
            {filteredEvents.length} evento{filteredEvents.length !== 1 ? "s" : ""} encontrado{filteredEvents.length !== 1 ? "s" : ""}
          </p>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEvents.map((event, index) => (
                <EventCard key={event.id} {...event} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                Nenhum evento encontrado com os filtros selecionados.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Events;
