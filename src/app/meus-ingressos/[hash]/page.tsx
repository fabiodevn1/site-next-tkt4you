"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Ticket,
  Send,
  ShoppingBag,
  Loader2,
  LogIn,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CheckinTimeline from "@/components/CheckinTimeline";
import TransferDialog from "@/components/TransferDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchTicketDetail } from "@/lib/api";

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  valid: { label: "Válido", variant: "default" },
  used: { label: "Utilizado", variant: "secondary" },
  cancelled: { label: "Cancelado", variant: "destructive" },
  transferred: { label: "Transferido", variant: "outline" },
  refunded: { label: "Reembolsado", variant: "destructive" },
  expired: { label: "Expirado", variant: "secondary" },
};

const TicketDetailPage = () => {
  const params = useParams();
  const hash = params.hash as string;
  const { data: session, status: authStatus } = useSession();
  const [showTransfer, setShowTransfer] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["ticket-detail", session?.accessToken, hash],
    queryFn: () => fetchTicketDetail(session!.accessToken, hash),
    enabled: !!session?.accessToken && !!hash,
  });

  const ticket = data?.data;
  const isAuthenticated = authStatus === "authenticated";
  const isAuthLoading = authStatus === "loading";

  const statusInfo = ticket ? statusLabels[ticket.status] ?? { label: ticket.status, variant: "outline" as const } : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 lg:pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-2xl">
          <Link
            href="/meus-ingressos"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Meus Ingressos
          </Link>

          {!isAuthenticated && !isAuthLoading && (
            <div className="bg-card rounded-2xl border border-border/50 p-6 text-center">
              <LogIn className="w-10 h-10 text-muted-foreground/60 mx-auto mb-3" />
              <p className="text-muted-foreground">
                Faça login para ver os detalhes do ingresso.
              </p>
            </div>
          )}

          {(isLoading || isAuthLoading) && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {isAuthenticated && !isLoading && !ticket && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Ticket className="w-16 h-16 text-muted-foreground/40 mb-4" />
              <p className="text-muted-foreground text-lg">
                Ingresso não encontrado.
              </p>
            </div>
          )}

          {ticket && (
            <div className="space-y-6">
              {/* Event Banner */}
              {ticket.event && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative h-48 rounded-2xl overflow-hidden"
                >
                  {(ticket.event.banner_image_url || ticket.event.cover_image_url) ? (
                    <img
                      src={ticket.event.banner_image_url ?? ticket.event.cover_image_url ?? ""}
                      alt={ticket.event.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Ticket className="w-12 h-12 text-muted-foreground/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-white font-display text-xl font-bold">
                      {ticket.event.name}
                    </h2>
                    <div className="flex flex-wrap gap-3 mt-1 text-sm text-white/80">
                      {ticket.event.starts_at && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(ticket.event.starts_at).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                      {ticket.event.venue_name && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {ticket.event.venue_name}
                          {ticket.event.venue_city && `, ${ticket.event.venue_city}`}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* QR Code + Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border/50 flex flex-col items-center"
              >
                <div className="bg-white p-4 rounded-xl mb-4">
                  <QRCodeSVG value={ticket.qr_data} size={200} />
                </div>
                <p className="text-xs font-mono text-muted-foreground mb-2">
                  {ticket.hash.toUpperCase()}
                </p>
                {statusInfo && (
                  <Badge variant={statusInfo.variant} className="text-sm">
                    {statusInfo.label}
                  </Badge>
                )}
              </motion.div>

              {/* Ticket Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-card rounded-2xl p-6 border border-border/50"
              >
                <h3 className="font-display text-lg font-bold mb-4">
                  Informações do Ingresso
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Tipo</p>
                    <p className="font-medium">{ticket.tier_name ?? "-"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Valor</p>
                    <p className="font-medium">
                      {ticket.price_paid ? `R$ ${ticket.price_paid}` : "Cortesia"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Titular</p>
                    <p className="font-medium">{ticket.holder_name ?? "-"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium truncate">{ticket.holder_email ?? "-"}</p>
                  </div>
                  {ticket.holder_document && (
                    <div>
                      <p className="text-muted-foreground">Documento</p>
                      <p className="font-medium">{ticket.holder_document}</p>
                    </div>
                  )}
                  {ticket.holder_phone && (
                    <div>
                      <p className="text-muted-foreground">Telefone</p>
                      <p className="font-medium">{ticket.holder_phone}</p>
                    </div>
                  )}
                  {ticket.ticket_number && (
                    <div>
                      <p className="text-muted-foreground">Número</p>
                      <p className="font-medium">{ticket.ticket_number}</p>
                    </div>
                  )}
                  {ticket.transferred_at && (
                    <div>
                      <p className="text-muted-foreground">Transferido em</p>
                      <p className="font-medium">
                        {new Date(ticket.transferred_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Checkin Timeline */}
              {ticket.checkins && ticket.checkins.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-card rounded-2xl p-6 border border-border/50"
                >
                  <h3 className="font-display text-lg font-bold mb-4">
                    Histórico de Check-ins
                  </h3>
                  <CheckinTimeline checkins={ticket.checkins} />
                </motion.div>
              )}

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                {ticket.is_transferable && ticket.event?.allow_transfer && (
                  <Button
                    onClick={() => setShowTransfer(true)}
                    className="flex-1"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Transferir Ingresso
                  </Button>
                )}
                {ticket.order_hash && (
                  <Button variant="outline" asChild className="flex-1">
                    <Link href={`/pedido-confirmado/${ticket.order_hash}`}>
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Ver Pedido
                    </Link>
                  </Button>
                )}
              </motion.div>
            </div>
          )}

          {ticket && (
            <TransferDialog
              open={showTransfer}
              onOpenChange={setShowTransfer}
              ticketHash={ticket.hash}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TicketDetailPage;
