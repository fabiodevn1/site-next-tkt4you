"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { ApiEvent } from "@/types/api";
import { useEvents } from "@/hooks/use-events";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const gradients = [
  "from-ticket-blue/80 via-ticket-sky/60 to-transparent",
  "from-ticket-blue-dark/80 via-ticket-blue/60 to-transparent",
  "from-ticket-sky/80 via-ticket-blue-light/60 to-transparent",
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const { data } = useEvents({ per_page: 5 });

  const featuredEvents = data?.data ?? [];
  const total = featuredEvents.length;

  useEffect(() => {
    if (total === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 5000);
    return () => clearInterval(timer);
  }, [total]);

  if (total === 0) {
    return (
      <section className="relative h-[70vh] min-h-[500px] max-h-[800px] overflow-hidden wave-bg bg-gradient-to-r from-ticket-blue/80 via-ticket-sky/60 to-transparent flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground mb-4">
            Ticket4You
          </h1>
          <p className="text-xl text-primary-foreground/80">
            Os melhores eventos em um só lugar
          </p>
        </div>
      </section>
    );
  }

  const event = featuredEvents[current];
  const prev = () => setCurrent((c) => (c === 0 ? total - 1 : c - 1));
  const next = () => setCurrent((c) => (c + 1) % total);

  const startsAt = new Date(event.starts_at);
  const formattedDate = format(startsAt, "dd MMM yyyy", { locale: ptBR });
  const locationText = event.is_online
    ? "Evento Online"
    : `${event.venue.name}, ${event.venue.city}`;

  return (
    <section className="relative h-[70vh] min-h-[500px] max-h-[800px] overflow-hidden wave-bg">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${event.cover_image_url || "/placeholder.svg"})`,
            }}
          />

          {/* Gradient Overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-r ${gradients[current % gradients.length]}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="max-w-2xl"
            >
              <span className="inline-block px-4 py-1 rounded-full text-sm font-medium ticket-gradient text-primary-foreground mb-4">
                Em Destaque
              </span>

              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-4 leading-tight">
                {event.name}
              </h1>

              <p className="text-xl md:text-2xl text-primary-foreground/90 mb-6 font-medium">
                {event.short_description || event.organizer?.name || ""}
              </p>

              <div className="flex flex-wrap gap-4 mb-8 text-primary-foreground/80">
                <span className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {formattedDate}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {locationText}
                </span>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href={`/event/${event.slug}`}>
                  <Button variant="ticket" size="xl">
                    Comprar Ingresso
                  </Button>
                </Link>
                <Link href={`/event/${event.slug}`}>
                  <Button
                    variant="outline"
                    size="xl"
                    className="border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    Saiba Mais
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-background/20 backdrop-blur-md flex items-center justify-center text-primary-foreground hover:bg-background/40 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-background/20 backdrop-blur-md flex items-center justify-center text-primary-foreground hover:bg-background/40 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots */}
      {total > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {featuredEvents.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-8 ticket-gradient"
                  : "bg-primary-foreground/40 hover:bg-primary-foreground/60"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroCarousel;
