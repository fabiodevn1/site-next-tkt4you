"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Ticket, Calendar, LogIn, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { fetchMyTickets } from "@/lib/api";

const MyTickets = () => {
  const { tickets: localTickets } = useCart();
  const { data: session, status: authStatus } = useSession();

  const { data: apiData, isLoading } = useQuery({
    queryKey: ["my-tickets", session?.accessToken],
    queryFn: () => fetchMyTickets(session!.accessToken),
    enabled: !!session?.accessToken,
  });

  const apiTickets = apiData?.data ?? [];
  const isAuthenticated = authStatus === "authenticated";
  const isAuthLoading = authStatus === "loading";

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

          {/* Not authenticated banner */}
          {!isAuthenticated && !isAuthLoading && (
            <div className="bg-card rounded-2xl border border-border/50 p-6 mb-8 text-center">
              <LogIn className="w-10 h-10 text-muted-foreground/60 mx-auto mb-3" />
              <p className="text-muted-foreground mb-1">
                Faça login para ver todos os seus ingressos.
              </p>
              <p className="text-xs text-muted-foreground">
                Clique em &quot;Entrar&quot; no menu para acessar sua conta.
              </p>
            </div>
          )}

          {/* Loading state */}
          {(isLoading || isAuthLoading) && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Authenticated: API tickets */}
          {isAuthenticated && !isLoading && apiTickets.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Ticket className="w-16 h-16 text-muted-foreground/40 mb-4" />
              <p className="text-muted-foreground text-lg">
                Você ainda não possui ingressos.
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                Explore os eventos e garanta o seu!
              </p>
            </div>
          )}

          {isAuthenticated && !isLoading && apiTickets.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {apiTickets.map((ticket, idx) => (
                <motion.div
                  key={ticket.hash}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    href={`/meus-ingressos/${ticket.hash}`}
                    className="block bg-card rounded-2xl border border-border/50 overflow-hidden hover:border-primary/40 transition-colors"
                  >
                    <div className="relative h-36">
                      {ticket.event?.cover_image_url ? (
                        <img
                          src={ticket.event.cover_image_url}
                          alt={ticket.event.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Ticket className="w-10 h-10 text-muted-foreground/40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4">
                        <p className="text-white font-bold truncate">
                          {ticket.event?.name ?? "Evento"}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                          {ticket.tier_name ?? "Ingresso"}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {ticket.hash.slice(0, 12).toUpperCase()}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-sm">
                        {ticket.event?.starts_at && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(ticket.event.starts_at).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-border/50 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground truncate max-w-[150px]">
                          {ticket.holder_name ?? "-"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(ticket.created_at).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Fallback: localStorage tickets for unauthenticated users */}
          {!isAuthenticated && !isAuthLoading && localTickets.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <p className="col-span-full text-sm text-muted-foreground mb-2">Ingressos desta sessão:</p>
              {localTickets.map((ticket, idx) => (
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
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyTickets;
