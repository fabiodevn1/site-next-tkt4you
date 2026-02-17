"use client";

import { motion } from "framer-motion";
import { Ticket, Calendar, MapPin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { events } from "@/data/events";

const MyTickets = () => {
  const { tickets } = useCart();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 lg:pt-28 pb-16 px-4">
        <div className="container mx-auto">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            <span className="cosmic-text">Meus Ingressos</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Veja todos os seus ingressos comprados.
          </p>

          {tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Ticket className="w-16 h-16 text-muted-foreground/40 mb-4" />
              <p className="text-muted-foreground text-lg">
                Você ainda não possui ingressos.
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                Explore os eventos e garanta o seu!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tickets.map((ticket, idx) => {
                const event = events.find((e) => e.id === ticket.eventId);
                return (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-card rounded-2xl border border-border/50 overflow-hidden"
                  >
                    <div className="relative h-36">
                      <img
                        src={ticket.eventImage}
                        alt={ticket.eventTitle}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4">
                        <p className="text-white font-bold truncate">
                          {ticket.eventTitle}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                          {ticket.ticketType}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {ticket.id.slice(0, 12).toUpperCase()}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{ticket.eventDate}</span>
                        </div>
                        {event && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-border/50 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {ticket.customerName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(ticket.purchasedAt).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyTickets;
