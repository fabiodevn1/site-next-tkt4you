"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchBarProps {
  onSearch: (term: string) => void;
  onFilterCategory: (category: string | null) => void;
  onFilterCity: (city: string | null) => void;
  categories: string[];
  cities: string[];
  activeCategory: string | null;
  activeCity: string | null;
}

const SearchBar = ({
  onSearch,
  onFilterCategory,
  onFilterCity,
  categories,
  cities,
  activeCategory,
  activeCity,
}: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const hasActiveFilters = activeCategory || activeCity;

  return (
    <section className="relative -mt-12 z-30 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="container mx-auto"
      >
        <div className="bg-card rounded-2xl p-4 md:p-6 shadow-2xl border border-border/50 ticket-glow">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar eventos, artistas, festivais..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full h-14 pl-12 pr-4 rounded-xl bg-muted border-2 border-transparent focus:border-primary focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex gap-2">
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

              <Button variant="ticket" size="lg" className="h-14 px-8 rounded-xl">
                Buscar
              </Button>
            </div>
          </div>

          {/* Filter Options */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t border-border/50 flex flex-wrap items-center gap-3">
                  <Select
                    value={activeCategory ?? "all"}
                    onValueChange={(val) => onFilterCategory(val === "all" ? null : val)}
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
                    onValueChange={(val) => onFilterCity(val === "all" ? null : val)}
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
                        onFilterCategory(null);
                        onFilterCity(null);
                      }}
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Limpar
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
};

export default SearchBar;
