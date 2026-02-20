"use client";

import { motion } from "framer-motion";
import { Heart, LogIn } from "lucide-react";
import { EventsGridSkeleton } from "@/components/skeletons";
import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import { useMyFavorites } from "@/hooks/use-favorites";

const Favoritos = () => {
  const { data: session, status: authStatus } = useSession();
  const isAuthenticated = authStatus === "authenticated";
  const isAuthLoading = authStatus === "loading";

  const { data: apiData, isLoading } = useMyFavorites();

  const events = apiData?.data ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 lg:pt-28 pb-16 px-4">
        <div className="container mx-auto">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            <span className="cosmic-text">Meus Favoritos</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Eventos que você salvou para acompanhar.
          </p>

          {!isAuthenticated && !isAuthLoading && (
            <div className="bg-card rounded-2xl border border-border/50 p-6 mb-8 text-center">
              <LogIn className="w-10 h-10 text-muted-foreground/60 mx-auto mb-3" />
              <p className="text-muted-foreground mb-1">
                Faça login para ver seus eventos favoritos.
              </p>
              <p className="text-xs text-muted-foreground">
                Clique em &quot;Entrar&quot; no menu para acessar sua conta.
              </p>
            </div>
          )}

          {(isLoading || isAuthLoading) && (
            <EventsGridSkeleton count={4} />
          )}

          {isAuthenticated && !isLoading && events.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Heart className="w-16 h-16 text-muted-foreground/40 mb-4" />
              <p className="text-muted-foreground text-lg">
                Você ainda não favoritou nenhum evento.
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                Explore os eventos e toque no coração para salvar!
              </p>
            </div>
          )}

          {isAuthenticated && !isLoading && events.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {events.map((event, idx) => (
                <EventCard
                  key={event.id}
                  id={String(event.id)}
                  eventId={event.id}
                  slug={event.slug}
                  title={event.name}
                  subtitle={event.short_description ?? ""}
                  date={
                    event.starts_at
                      ? new Date(event.starts_at).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : ""
                  }
                  location={
                    [event.venue?.name, event.venue?.city]
                      .filter(Boolean)
                      .join(", ") || ""
                  }
                  price={event.min_price ?? 0}
                  image={event.cover_image_url ?? "/placeholder-event.jpg"}
                  category={event.category?.name ?? "Evento"}
                  index={idx}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Favoritos;
