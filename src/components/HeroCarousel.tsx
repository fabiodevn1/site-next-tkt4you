"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface FeaturedEvent {
  id: string;
  title: string;
  artist: string;
  date: string;
  location: string;
  image: string;
  gradient: string;
}

const featuredEvents: FeaturedEvent[] = [
  {
    id: "1",
    title: "Cosmic Night Festival",
    artist: "DJ Nebula & Friends",
    date: "15 Mar 2025",
    location: "Arena Galaxy, São Paulo",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1920&q=80",
    gradient: "from-ticket-blue/80 via-ticket-sky/60 to-transparent",
  },
  {
    id: "2",
    title: "Stellar Rock Tour",
    artist: "The Asteroids",
    date: "22 Mar 2025",
    location: "Estádio Orbital, Rio de Janeiro",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1920&q=80",
    gradient: "from-ticket-blue-dark/80 via-ticket-blue/60 to-transparent",
  },
  {
    id: "3",
    title: "Neon Dreams",
    artist: "Aurora Beats",
    date: "30 Mar 2025",
    location: "Centro de Eventos Cosmos, Curitiba",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1920&q=80",
    gradient: "from-ticket-sky/80 via-ticket-blue-light/60 to-transparent",
  },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % featuredEvents.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c === 0 ? featuredEvents.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c + 1) % featuredEvents.length);

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
            style={{ backgroundImage: `url(${featuredEvents[current].image})` }}
          />

          {/* Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r ${featuredEvents[current].gradient}`} />
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
                {featuredEvents[current].title}
              </h1>

              <p className="text-xl md:text-2xl text-primary-foreground/90 mb-6 font-medium">
                {featuredEvents[current].artist}
              </p>

              <div className="flex flex-wrap gap-4 mb-8 text-primary-foreground/80">
                <span className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {featuredEvents[current].date}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {featuredEvents[current].location}
                </span>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href={`/event/${featuredEvents[current].id}`}>
                  <Button variant="ticket" size="xl">
                    Comprar Ingresso
                  </Button>
                </Link>
                <Button variant="outline" size="xl" className="border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10">
                  Saiba Mais
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
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

      {/* Dots */}
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
    </section>
  );
};

export default HeroCarousel;
