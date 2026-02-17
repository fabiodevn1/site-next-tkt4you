"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import EventCard from "./EventCard";
import { events } from "@/data/events";
import type { Event } from "@/data/events";

export type { Event };
export { events };

interface EventsGridProps {
  filteredEvents?: Event[];
}

const EventsGrid = ({ filteredEvents }: EventsGridProps) => {
  const displayEvents = filteredEvents ?? events;

  return (
    <section className="py-16 px-4" id="events">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            <span className="cosmic-text">Próximos Eventos</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Descubra os melhores shows, festivais e eventos. Garanta seu ingresso agora!
          </p>
        </motion.div>

        {displayEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayEvents.map((event, index) => (
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

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/eventos"
            className="inline-block px-8 py-4 rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-semibold"
          >
            Ver Todos os Eventos
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default EventsGrid;
