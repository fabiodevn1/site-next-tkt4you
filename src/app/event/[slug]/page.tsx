"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Minus,
  Plus,
  Share2,
  ArrowLeft,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEventBySlug } from "@/hooks/use-events";
import { mapApiEventToEvent } from "@/data/events";
import { useCart } from "@/contexts/CartContext";
import FavoriteButton from "@/components/FavoriteButton";
import { EventDetailSkeleton } from "@/components/skeletons";

const EventDetail = () => {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const { addToCart } = useCart();
  const [selectedTicket, setSelectedTicket] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { data, isLoading, error } = useEventBySlug(slug);

  const event = useMemo(() => {
    if (!data?.data) return null;
    return mapApiEventToEvent(data.data);
  }, [data]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <EventDetailSkeleton />
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <p className="text-muted-foreground text-lg">Evento não encontrado.</p>
          <Link href="/eventos">
            <Button variant="outline">Ver todos os eventos</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const hasTickets = event.tickets.length > 0;
  const currentTicket = hasTickets ? event.tickets[selectedTicket] : null;
  const totalPrice = currentTicket ? currentTicket.price * quantity : 0;

  const handleAddToCart = () => {
    if (!currentTicket) return;
    addToCart({
      eventId: event.id,
      eventTitle: event.title,
      eventImage: event.image,
      eventDate: event.date,
      ticketTierId: currentTicket.id,
      ticketType: currentTicket.type,
      price: currentTicket.price,
      quantity,
    });
    toast.success("Ingresso adicionado ao carrinho!");
  };

  const handleBuyNow = () => {
    if (!currentTicket) return;
    addToCart({
      eventId: event.id,
      eventTitle: event.title,
      eventImage: event.image,
      eventDate: event.date,
      ticketTierId: currentTicket.id,
      ticketType: currentTicket.type,
      price: currentTicket.price,
      quantity,
    });
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] wave-bg">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${event.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-black/80 hover:text-black mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1 rounded-full text-sm font-medium ticket-gradient text-primary-foreground mb-4">
                {event.category}
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-2 drop-shadow-lg">
                {event.title}
              </h1>
              <p className="text-xl text-black/80 drop-shadow-md">{event.subtitle}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Event Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-6 text-foreground bg-card rounded-2xl p-6 border border-border/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data</p>
                    <p className="font-semibold">{event.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Horário</p>
                    <p className="font-semibold">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Local</p>
                    <p className="font-semibold">{event.location}</p>
                  </div>
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border/50"
              >
                <h2 className="font-display text-2xl font-bold mb-4">Sobre o Evento</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>

                {event.lineup.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-display text-lg font-bold mb-3">Line-up</h3>
                    <div className="flex flex-wrap gap-2">
                      {event.lineup.map((artist) => (
                        <span
                          key={artist}
                          className="px-4 py-2 rounded-full bg-muted text-foreground font-medium"
                        >
                          {artist}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Location */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-2xl p-6 border border-border/50"
              >
                <h2 className="font-display text-2xl font-bold mb-4">Localização</h2>
                <p className="text-muted-foreground mb-2">{event.location}</p>
                <p className="text-sm text-muted-foreground">{event.address}</p>
                <div className="mt-4 h-48 rounded-xl bg-muted flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Mapa do local</span>
                </div>
              </motion.div>
            </div>

            {/* Ticket Selection */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="sticky top-24 bg-card rounded-2xl p-6 border border-border/50 ticket-glow"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-xl font-bold">
                    {hasTickets ? "Selecione seu ingresso" : "Ingressos"}
                  </h3>
                  <div className="flex gap-2">
                    {data?.data?.id && (
                      <FavoriteButton
                        eventId={data.data.id}
                        className="w-10 h-10"
                      />
                    )}
                    <button className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {hasTickets ? (
                  <>
                    <div className="space-y-3 mb-6">
                      {event.tickets.map((ticket, index) => (
                        <button
                          key={ticket.type}
                          onClick={() => {
                            setSelectedTicket(index);
                            setQuantity(1);
                          }}
                          className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                            selectedTicket === index
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold text-foreground">{ticket.type}</p>
                              <p className="text-sm text-muted-foreground">
                                <Users className="w-4 h-4 inline mr-1" />
                                {ticket.available} disponíveis
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-display font-bold text-lg text-primary">
                                R$ {ticket.price.toFixed(2)}
                              </p>
                              {selectedTicket === index && (
                                <Check className="w-5 h-5 text-primary inline" />
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-semibold">Quantidade</span>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                        <span className="font-display text-xl font-bold w-8 text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(Math.min(10, quantity + 1))}
                          className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="border-t border-border pt-4 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Total</span>
                        <span className="font-display text-3xl font-bold ticket-text">
                          R$ {totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <Button variant="ticket" size="xl" className="w-full mb-3" onClick={handleBuyNow}>
                      Comprar Agora
                    </Button>
                    <Button variant="outline" size="lg" className="w-full" onClick={handleAddToCart}>
                      Adicionar ao Carrinho
                    </Button>
                  </>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Ingressos em breve disponíveis.
                  </p>
                )}

                <p className="text-center text-xs text-muted-foreground mt-4">
                  Pagamento 100% seguro
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EventDetail;
